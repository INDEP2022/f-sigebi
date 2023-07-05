import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { RECORDS_ACCOUNT_STATEMENTS_COLUMNS } from './record-account-statements-columns';

import { RecordAccountStatementsAccountsService } from 'src/app/core/services/catalogs/record-account-statements-accounts.service';
import { RecordAccountStatementsService } from 'src/app/core/services/catalogs/record-account-statements.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-record-account-statements',
  templateUrl: './record-account-statements.component.html',
  styles: [],
})
export class RecordAccountStatementsComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  itemsBancos = new DefaultSelect();
  itemsCuentas = new DefaultSelect();
  columnFilters: any = [];
  validation: boolean = false;

  banks = new DefaultSelect();
  bankAccountSelect = new DefaultSelect();

  dataAccount: LocalDataSource = new LocalDataSource();
  dataAccountPaginated: number;
  current: string;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private recordAccountStatementsService: RecordAccountStatementsService,
    private recordAccountStatementsAccountsService: RecordAccountStatementsAccountsService
  ) {
    super();
    this.settings.columns = RECORDS_ACCOUNT_STATEMENTS_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions.add = false;
    this.settings.actions.delete = true;
    this.settings.actions.edit = false;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.searchBanks();
    this.dataAccount
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'dateMotion':
                searchFilter = SearchFilter.EQ;
                break;
              case 'deposit':
                searchFilter = SearchFilter.EQ;
                break;
              case 'withdrawal':
                searchFilter = SearchFilter.EQ;
                break;
              case 'cveConcept':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              console.log(
                (this.columnFilters[field] = `${searchFilter}:${filter.search}`)
              );
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params.value.page = 1;
          if (this.dataAccountPaginated) {
            this.searchDataAccount(this.dataAccountPaginated);
          }
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.dataAccountPaginated) {
        this.searchDataAccount(this.dataAccountPaginated);
      }
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      bankSelect: [null, Validators.required],
      account: [null, Validators.required],
      square: [null, Validators.nullValidator],
      branch: [null, Validators.nullValidator],
      accountType: [null, Validators.nullValidator],
      currency: [null, Validators.nullValidator],
      description: [null, Validators.nullValidator],
      balanceOf: [null, Validators.nullValidator],
      balanceAt: [null, Validators.nullValidator],
    });
  }

  // Trae la lista de bancos
  searchBanks() {
    this.recordAccountStatementsService
      .getAll(this.params.getValue())
      .subscribe({
        next: (response: { data: any[]; count: number }) => {
          this.banks = new DefaultSelect(response.data, response.count);
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.alert('warning', 'No existen bancos', ``);
        },
      });
  }

  // Asigna el valor del banco seleccionado a la función "searchBankAccount"
  onBankSelectChange(value: any) {
    if (value && value.bankCode) {
      const bankCode = value.bankCode;
      this.searchBankAccount(bankCode);
    } else {
      this.cleandInfoGoods();
    }
  }

  // Toma el banco seleccionado y busca todas las cuentas pertenecientes a ese banco
  searchBankAccount(bankCode: string) {
    this.recordAccountStatementsAccountsService
      .getById(bankCode, this.params.getValue())
      .subscribe({
        next: (response: { data: any[]; count: number }) => {
          this.bankAccountSelect = new DefaultSelect(
            response.data,
            response.count
          );
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.alert('warning', 'No existen cuentas', ``);
        },
      });
  }

  // Establece los valores en los input de datos de la cuenta
  onBankAccountSelectChange(value: any) {
    const accountNumber = value.accountNumber;
    this.searchDataAccount(accountNumber);

    // Obtener los valores correspondientes de la cuenta seleccionada
    const square = value?.square ?? 'Sin datos';
    const branch = value?.branch ?? 'Sin datos';
    const accountType = value?.accountType ?? 'Sin datos';
    let currency = value?.cveCurrency ?? 'Sin datos';

    // Quitar las comillas simples del valor de currency, si existen
    currency = currency.replace(/'/g, '');

    // Asignar los valores al formulario
    this.form.get('square').setValue(square);
    this.form.get('branch').setValue(branch);
    this.form.get('accountType').setValue(accountType);
    this.form.get('currency').setValue(currency);
    const current = this.form.get('currency').value;
    this.current = current;
  }

  // Establece los valores de movimientos de la cuenta seleccionada a la tabla
  searchDataAccount(accountNumber: number) {
    this.dataAccountPaginated = accountNumber;
    this.recordAccountStatementsAccountsService
      .getDataAccount(accountNumber, this.params.getValue())
      .subscribe({
        next: response => {
          this.loading = true;
          const dataSource = new LocalDataSource(response.data); // Crear una nueva instancia de LocalDataSource con los datos
          this.dataAccount = dataSource; // Asignar la instancia de LocalDataSource a dataAccount
          this.totalItems = response.count;
          this.loading = false;

          // Imprimir los valores de numberGood en el console.log
          const numberGoodValues = response.data.map(
            (item: any) => item.numberGood
          );
          console.log('Valores de numberGood:', numberGoodValues);
        },
        error: (err: any) => {
          this.loading = false;
          this.alert(
            'warning',
            'No existen datos de la cuenta seleccionada',
            ``
          );
        },
      });
  }

  cleandInfoGoods() {
    this.banks = null;
    this.bankAccountSelect = null;
    this.form.get('account').reset();
    this.form.get('square').reset();
    this.form.get('branch').reset();
    this.form.get('accountType').reset();
    this.form.get('currency').reset();
  }
}

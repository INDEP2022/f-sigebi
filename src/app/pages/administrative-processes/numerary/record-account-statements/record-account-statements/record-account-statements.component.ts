import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { RECORDS_ACCOUNT_STATEMENTS_COLUMNS } from './record-account-statements-columns';

import { DatePipe } from '@angular/common';
import {
  IDateAccountBalance,
  IRecordAccountStatements,
} from 'src/app/core/models/catalogs/record-account-statements.model';

import { RecordAccountStatementsAccountsService } from 'src/app/core/services/catalogs/record-account-statements-accounts.service';
import { RecordAccountStatementsService } from 'src/app/core/services/catalogs/record-account-statements.service';
import { TvalTable5Service } from 'src/app/core/services/catalogs/tval-table5.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { RecordAccountStatementsModalComponent } from '../record-account-statements-modal/record-account-statements-modal.component';

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

  factasStatusCta: any;
  selectedDateBalanceOf: Date;
  selectedDateBalanceAt: Date;
  balanceDateAccount: IDateAccountBalance;
  current: string;
  balance: string;
  accountDate: number;

  variableOf: Date;
  variableAt: Date;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private recordAccountStatementsService: RecordAccountStatementsService,
    private recordAccountStatementsAccountsService: RecordAccountStatementsAccountsService,
    private tvalTable5Service: TvalTable5Service,
    private datePipe: DatePipe
  ) {
    super();
    this.settings.columns = RECORDS_ACCOUNT_STATEMENTS_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions.add = false;
    this.settings.actions.delete = false;
    this.settings.actions.edit = false;
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

  // Trae la lista de bancos
  searchBanks() {
    this.dataAccount = new LocalDataSource();
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
    this.form.get('account').reset();
    this.form.get('accountType').reset();
    this.form.get('square').reset();
    this.form.get('branch').reset();
    this.form.get('currency').reset();
    this.form.get('description').reset();
    this.totalItems = 0;
    this.cleandInfoDate();
    this.bankAccountSelect = new DefaultSelect();
    this.dataAccount = new LocalDataSource();
    if (value && value.bankCode) {
      const bankCode = value.bankCode;
      this.searchBankAccount(bankCode);
    } else {
      this.cleandInfoAll();
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

  // Establece los valores en los inputs de datos de la cuenta seleccionada
  onBankAccountSelectChange(value: any) {
    this.form.get('accountType').reset();
    this.form.get('square').reset();
    this.form.get('branch').reset();
    this.form.get('currency').reset();
    this.form.get('description').reset();
    this.totalItems = 0;
    this.cleandInfoDate();
    this.dataAccount = new LocalDataSource();
    const accountNumber = value.accountNumber;
    this.accountDate = value.accountNumber;
    this.searchDataAccount(accountNumber);

    // Obtener los valores correspondientes de la cuenta seleccionada
    const square = value?.square;
    const branch = value?.branch;
    const accountType = value?.accountType;
    let currency = value.cveCurrency;
    this.current = currency;
    this.searchCurrent(currency);

    // Quitar las comillas simples del valor de currency, si existen
    currency = currency.replace(/'/g, '');

    // Asignar los valores al formulario
    this.form.get('square').setValue(square);
    this.form.get('branch').setValue(branch);
    this.form.get('accountType').setValue(accountType);
    this.form.get('currency').setValue(currency);
  }

  searchCurrent(currency: string) {
    this.tvalTable5Service.getCurrent(currency).subscribe({
      next: response => {
        let current = response.data;
        let currentAccount = current[0].otvalor02;
        this.form.get('description').setValue(currentAccount);
        this.loading = false;
      },
      // error: (err: any) => {
      //   this.loading = false;
      //   this.alert('warning', 'No existen monedas', ``);
      // },
    });
  }

  // Genera el saldo de la cuenta seleccionada al escoger un rango de fechas
  DateAccountBalance() {
    const balanceOf = this.datePipe.transform(this.variableOf, 'dd/MM/yyyy');
    const balanceAt = this.datePipe.transform(this.variableAt, 'dd/MM/yyyy');
    const model: IDateAccountBalance = {
      noAccount: this.accountDate,
      tiDateCalc: balanceOf,
      tiDateCalcEnd: balanceAt,
    };
    this.recordAccountStatementsAccountsService
      .getAccountBalanceDate(model)
      .subscribe({
        next: response => {
          this.balance = response.result + ' ' + this.current;
        },
        error: error => {
          this.alert('warning', 'Error', 'No es posible generar el saldo');
        },
      });
  }

  // Establece los valores de movimientos de la cuenta seleccionada a la tabla
  searchDataAccount(accountNumber: number) {
    this.loading = true;
    this.dataAccountPaginated = accountNumber;
    this.recordAccountStatementsAccountsService
      .getDataAccount(accountNumber, this.params.getValue())
      .subscribe({
        next: response => {
          this.loading = true;
          const dataSource = new LocalDataSource(response.data);
          this.dataAccount = dataSource;
          this.totalItems = response.count;
          this.loading = false;
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
    this.searchFactasStatusCta(accountNumber);
  }

  // Trae el nombre del banco y número de cuenta que se establece en el modal de transferencia
  searchFactasStatusCta(accountNumber: number) {
    this.recordAccountStatementsAccountsService
      .getFactasStatusCta(accountNumber)
      .subscribe({
        next: response => {
          this.factasStatusCta = response;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.alert('warning', 'No existen bancos', ``);
        },
      });
  }

  //Abre el modal de transferencia de saldos
  openModal(movimentAccount: IRecordAccountStatements) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      ignoreBackdropClick: false,
      movimentAccount: {
        ...movimentAccount,
        factasStatusCta: this.factasStatusCta,
      },
      dataAccountPaginated: this.dataAccountPaginated,
      callback: (next: boolean) => {
        if (next) this.searchDataAccount(this.dataAccountPaginated);
      },
    };
    this.modalService.show(RecordAccountStatementsModalComponent, modalConfig);
  }

  cleandInfoAll() {
    this.form.reset();
    this.totalItems = 0;
    this.searchBanks();
    this.balance = null;
  }

  cleandInfo() {
    this.totalItems = 0;
    this.form.reset();
    this.searchBanks();
  }

  cleandInfoDate() {
    this.form.get('balanceOf').reset();
    this.form.get('balanceAt').reset();
    this.balance = null;
  }
}

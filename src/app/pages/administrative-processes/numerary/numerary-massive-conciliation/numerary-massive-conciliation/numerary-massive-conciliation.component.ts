import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { RecordAccountStatementsAccountsService } from 'src/app/core/services/catalogs/record-account-statements-accounts.service';
import { RecordAccountStatementsService } from 'src/app/core/services/catalogs/record-account-statements.service';
import { TvalTable5Service } from 'src/app/core/services/catalogs/tval-table5.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  NUMERARY_MASSIVE_CONCILIATION_COLUMNS,
  NUMERARY_MASSIVE_CONCILIATION_COLUMNS2,
} from './numerary-massive-conciliation-columns';

@Component({
  selector: 'app-numerary-massive-conciliation',
  templateUrl: './numerary-massive-conciliation.component.html',
  styles: [],
})
export class NumeraryMassiveConciliationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  form2: FormGroup;
  data: LocalDataSource = new LocalDataSource();
  dataAccountPaginated: number;

  bankAccountSelect = new DefaultSelect();
  bankCode: string;
  banks = new DefaultSelect();

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  columnFilters: any = [];
  accountDate: number;
  current: string;

  public override settings: any = {
    columns: NUMERARY_MASSIVE_CONCILIATION_COLUMNS,
    hideSubHeader: false,
    actions: {
      add: false,
      delete: false,
      edit: false,
    },
  };

  public settings2: any = {
    columns: NUMERARY_MASSIVE_CONCILIATION_COLUMNS2,
    hideSubHeader: false,
    actions: {
      add: false,
      delete: false,
      edit: false,
    },
  };

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private recordAccountStatementsAccountsService: RecordAccountStatementsAccountsService,
    private recordAccountStatementsService: RecordAccountStatementsService,
    private tvalTable5Service: TvalTable5Service
  ) {
    super();
    this.prepareForm();
    this.prepareForm2();
    this.searchDataAccount();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      dateTesofe: [null, Validators.nullValidator],
      dateOf: [null, Validators.nullValidator],
      dateAt: [null, Validators.nullValidator],
    });
  }

  private prepareForm2(): void {
    this.form2 = this.fb.group({
      bank: [null, Validators.nullValidator],
      bankAccount: [null, Validators.nullValidator],
      deposit: [null, Validators.nullValidator],
      current: [null, Validators.nullValidator],
    });
  }

  ngOnInit(): void {
    this.prepareForm();
    this.prepareForm2();
    this.searchBanks(new ListParams());
    this.searchDataAccount();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
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
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params.value.page = 1;
          this.params = this.pageFilter(this.params);
          this.searchDataAccount();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchDataAccount());
  }

  // Trae toda la información que se pasa a las tablas
  searchDataAccount() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.recordAccountStatementsAccountsService
      .getDataAccountConciliation(params)
      .subscribe({
        next: response => {
          this.loading = true;
          const transformedData = response.data.map(item => ({
            ...item,
          }));
          this.data = new LocalDataSource(transformedData);
          this.totalItems = response.count;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.alert(
            'warning',
            'No existen movimientos de la cuenta seleccionada',
            ``
          );
        },
      });
  }

  // Trae la lista de bancos por defecto
  searchBanks(params: ListParams) {
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

  // Permite buscar los bancos por nombre
  onSearchName(inputElement: any) {
    const name = inputElement.value;
    setTimeout(() => {
      this.recordAccountStatementsService
        .getAllDinamicName(name, this.params.getValue())
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
    }, 3000);
  }

  // Asigna el valor del banco seleccionado a la función "searchBankAccount"
  onBankSelectChange(value: any) {
    // this.cleandInfoDate();
    this.bankAccountSelect = new DefaultSelect();
    if (value && value.bankCode) {
      const bankCode = value.bankCode;
      this.searchBankAccount(bankCode);
    } else {
      this.cleandInfoAll();
    }
  }

  // Toma el banco seleccionado y busca todas las cuentas pertenecientes a ese banco
  searchBankAccount(bankCode: string) {
    this.bankCode = bankCode;
    this.recordAccountStatementsAccountsService
      .getById(bankCode, this.params.getValue())
      .subscribe({
        next: response => {
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

  onClearSelection() {
    this.searchBankAccount(this.bankCode);
  }

  //
  onSearchAccount(inputElement: any) {
    const account = inputElement.value;
    setTimeout(() => {
      this.recordAccountStatementsAccountsService
        .getById2(this.bankCode, account, this.params.getValue())
        .subscribe({
          next: response => {
            const filteredAccounts = response.data.filter(item =>
              item.accountNumber.includes(account)
            );
            this.bankAccountSelect = new DefaultSelect(
              filteredAccounts,
              response.count
            );
            this.loading = false;
          },
          error: (err: any) => {
            this.loading = false;
            this.alert('warning', 'No existen bancos', ``);
          },
        });
    }, 3000);
  }

  // Establece los valores en los inputs de datos de la cuenta seleccionada
  onBankAccountSelectChange(value: any) {
    this.form2.get('current').reset();
    const accountNumber = value.accountNumber;
    this.accountDate = value.accountNumber;

    // Obtener los valores correspondientes de la cuenta seleccionada
    let currency = value.cveCurrency;
    this.current = currency;
    this.searchCurrent(currency);

    // Quitar las comillas simples del valor de currency, si existen
    currency = currency.replace(/'/g, '');
  }

  // Permite buscar la descripcion de la moneda
  searchCurrent(currency: string) {
    console.log(currency);
    if (currency === `'M'`) {
      console.log('Confirma');
      currency = 'PESO MEXICANO';
      this.form2.get('current').setValue(currency);
    } else {
      let currenct = currency.replace(/'/g, '');
      this.tvalTable5Service.getCurrent(currenct).subscribe({
        next: response => {
          let current = response.data;
          console.log(current);
          let currentAccount = current[0].otvalor02;
          let currentAccount2 = current[0].otvalor01;
          console.log(currentAccount);
          console.log(currentAccount2);
          if (currentAccount === 'M' || currentAccount === 'MM') {
            currentAccount = 'PESO MEXICANO';
          }
          this.form2.get('current').setValue(currentAccount);
          this.loading = false;
        },
      });
    }
  }

  cleandInfoAll() {
    this.form.reset();
    this.totalItems = 0;
    this.searchBanks(new ListParams());
  }

  cleandInfoDate() {
    this.form.get('bankAccount').reset();
    this.form.get('deposit').reset();
    this.form.get('current').reset();
  }
}

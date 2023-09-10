import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
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
  data: LocalDataSource = new LocalDataSource();
  itemSelected: any;
  banks = new DefaultSelect();
  bankAccountSelect = new DefaultSelect();
  codeBanco: string = '';
  dataAccount: LocalDataSource = new LocalDataSource();
  // dataAccountPaginated: number;
  dataAccountPaginated: string;
  factasStatusCta: any;
  selectedDateBalanceOf: Date;
  selectedDateBalanceAt: Date;
  balanceDateAccount: IDateAccountBalance;
  current: string;
  balance: string;
  accountDate: number;
  maxDate = new Date();
  variableOf: Date;
  variableAt: Date;
  bankCode: string;
  checks: any;
  cveAccount: string;
  dateMotionFilter: boolean;
  newBank: string = '';
  accouncveAccount: string;

  paramsSubject: BehaviorSubject<ListParams> = new BehaviorSubject<ListParams>(
    new ListParams()
  );

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private accountMovementService: AccountMovementService,
    private recordAccountStatementsService: RecordAccountStatementsService,
    private recordAccountStatementsAccountsService: RecordAccountStatementsAccountsService,
    private tvalTable5Service: TvalTable5Service,
    private datePipe: DatePipe
  ) {
    super();
    this.settings.columns = RECORDS_ACCOUNT_STATEMENTS_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions.add = false;
    this.settings.actions.delete = true;
    this.settings.actions.edit = false;

    this.settings.rowClassFunction = (row: any) => {
      const genderTransfer = row.data.genderTransfer;
      const numberReturnPayCheck = row.data.numberReturnPayCheck;
      if (genderTransfer === 'S' && numberReturnPayCheck === null) {
        return 'bg-yellow-record';
      } else if (numberReturnPayCheck !== null) {
        return 'bg-blue-record';
      } else {
        return 'bg-green-record';
      }

      return '';
    };
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
      balance: [null, Validators.nullValidator],
    });
  }

  ngOnInit(): void {
    this.prepareForm();
    this.searchBanks(new ListParams());
    this.getEventNew(new ListParams());
    this.searchCheck();
    this.dataAccount
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((change: { action: string; filter: { filters: any } }) => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'dateMotion':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
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
          if (this.dataAccountPaginated) {
            // this.searchDataAccount(this.dataAccountPaginated);
            this.getEvent();
          }
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.dataAccountPaginated) {
        // this.searchDataAccount(this.dataAccountPaginated);
        this.getEvent();
      }
    });
  }

  formatDate(dateString: string): string {
    if (dateString === '') {
      return '';
    }

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  // Trae la lista de bancos por defecto
  searchBanks(params: ListParams) {
    this.loading = true;
    this.bankAccountSelect = new DefaultSelect();
    this.recordAccountStatementsService.getAll(params).subscribe({
      next: (response: { data: any[]; count: number }) => {
        this.loading = true;
        this.banks = new DefaultSelect(response.data, response.count);
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.alert('warning', 'No Existen Bancos', ``);
      },
    });
  }

  // Permite buscar los bancos por nombre
  onSearchName(inputElement: any) {
    const name = inputElement.value.accountNumber.cveBank;
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
            // this.alert('warning', 'No Existen Bancos con esa Descripción', ``);
          },
        });
    }, 3000);
  }
  onSearchNameAccount(inputElement: any) {
    console.log(inputElement);
    const name = inputElement.value.cveBank;
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
            // this.alert('warning', 'No Existen Bancos con esa Descripción', ``);
          },
        });
    }, 3000);
  }

  // Asigna el valor del banco seleccionado a la función "searchBankAccount"
  onBankSelectChange(value: any) {
    // this.form.get('account').reset();
    // this.form.get('accountType').reset();
    // this.form.get('square').reset();
    // this.form.get('branch').reset();
    // this.form.get('currency').reset();
    // this.form.get('description').reset();
    // this.totalItems = 0;
    // this.cleandInfoDate();
    // console.log(value);
    // // this.bankAccountSelect = new DefaultSelect();
    // this.loading = false;
    // console.log(value);
    // if (value && value.cve_banco) {
    //   const bankCode = value.cve_cuenta;
    //   console.log(bankCode);
    //   // this.searchBankAccount(bankCode, this.paramsSubject);
    //   // let paramsB = new ListParams();
    //   // paramsB['filter.accountNumber.cveAccount'] = value.cve_cuenta;
    //   // this.getEvent(paramsB);
    //   this.form.get('account').setValue(value?.cveAccount);
    //   let currency = value?.cveCurrency;
    //   this.current = currency;
    //   this.searchCurrent(currency);
    //   currency = currency.replace(/'/g, '');
    //   this.form.get('square').setValue(value?.square);
    //   this.form.get('branch').setValue(value?.branch);
    //   this.form.get('accountType').setValue(value?.accountType);
    //   this.form.get('currency').setValue(currency);
    //   // this.getEvent();
    //   this.loading = false;
    // } else {
    //   this.cleandInfoAll();
    //   this.loading = false;
    // }
    this.form.get('accountType').reset();
    this.form.get('square').reset();
    this.form.get('branch').reset();
    this.form.get('currency').reset();
    this.form.get('description').reset();
    this.totalItems = 0;
    this.cleandInfoDate();
    const cveAccount = value.cveAccount;
    // this.accountDate = value.dateInsertion;
    console.log(value);
    this.searchDataAccount(cveAccount);
    const square = value?.square;
    const branch = value?.branch;
    const accountType = value?.accountType;
    this.form.get('account').setValue(value?.accountNumber);
    let currency = value.cveCurrency;
    this.current = currency;
    this.searchCurrent(currency);
    currency = currency.replace(/'/g, '');
    this.form.get('square').setValue(square);
    this.form.get('branch').setValue(branch);
    this.form.get('accountType').setValue(accountType);
    this.form.get('currency').setValue(currency);
  }

  searchBankAccount(
    bankCode: string,
    paramsSubject: BehaviorSubject<ListParams>
  ) {
    this.bankCode = bankCode;
    const params = paramsSubject.getValue();

    this.recordAccountStatementsAccountsService
      .getById(this.bankCode, params)
      .subscribe({
        next: response => {
          response.data.map(item => {
            item['accountAndNumber'] = item.cve_cuenta;
          });

          this.form.get('account').patchValue(response.data[0]);
          this.loading = false;
        },
        // this.data.load(this.documents);
        error: (err: any) => {
          this.loading = false;
          this.bankAccountSelect = new DefaultSelect();
        },
      });
  }

  onClearSelection() {
    this.searchBankAccount(this.bankCode, this.paramsSubject);
    this.getEvent();
  }

  onSearchAccount(inputElement: any) {
    const account = inputElement.value;
    setTimeout(() => {
      this.recordAccountStatementsAccountsService
        .getById2(this.bankCode, account, this.params.getValue())
        .subscribe({
          next: response => {
            const filteredAccounts = response.data.filter(
              (item: { cveAccount: string | any[] }) =>
                item.cveAccount.includes(account)
            );
            this.bankAccountSelect = new DefaultSelect(
              filteredAccounts,
              response.count
            );
            this.loading = false;
          },
          error: (err: any) => {
            this.loading = false;
          },
        });
    }, 3000);
  }

  onBankAccountSelectChange(value: any) {
    this.form.get('accountType').reset();
    this.form.get('square').reset();
    this.form.get('branch').reset();
    this.form.get('currency').reset();
    this.form.get('description').reset();
    this.totalItems = 0;
    this.cleandInfoDate();
    const cveAccount = value.accountNumber.cveAccount;
    this.accountDate = value.dateInsertion;
    console.log(value);
    this.searchDataAccount(cveAccount);
    const square = value?.accountNumber.square;
    const branch = value?.accountNumber.branch;
    const accountType = value?.accountNumber.accountType;
    let paramsB = new ListParams();
    this.form.get('bankSelect').setValue(value?.accountNumber.cveBank);
    let currency = value.accountNumber.cveCurrency;
    this.current = currency;
    this.searchCurrent(currency);
    currency = currency.replace(/'/g, '');
    this.form.get('square').setValue(square);
    this.form.get('branch').setValue(branch);
    this.form.get('accountType').setValue(accountType);
    this.form.get('currency').setValue(currency);
  }

  searchCurrent(currency: string) {
    if (currency === `'M'`) {
      currency = 'PESO MEXICANO';
      this.form.get('description').setValue(currency);
    }
    this.tvalTable5Service.getCurrent(currency).subscribe({
      next: (response: { data: any }) => {
        let current = response.data;
        let currentAccount = current[0].otvalor02;
        this.form.get('description').setValue(currentAccount);
        this.loading = false;
      },
    });
  }

  // Genera el saldo de la cuenta seleccionada al escoger un rango de fechas
  DateAccountBalance() {
    const balanceOf = this.datePipe.transform(
      this.variableOf,
      'yyyy-MM-dd HH:MM:SS'
    );
    const balanceAt = this.datePipe.transform(
      this.variableAt,
      'yyyy-MM-dd HH:MM:SS'
    );

    if (!balanceOf && !balanceAt) {
      this.alert('warning', 'Debe ingresar las fechas de saldo', '');
      return;
    } else if (!balanceOf) {
      this.alert('warning', 'Debe ingresar la fecha de "Saldo de"', '');
      return;
    } else if (!balanceAt) {
      this.alert('warning', 'Debe ingresar la fecha de "Saldo a:"', '');
      return;
    }

    const model: IDateAccountBalance = {
      noAccount: Number(this.cveAccount),
      tiDateCalc: balanceOf,
      tiDateCalcEnd: balanceAt,
    };

    this.recordAccountStatementsAccountsService
      .getAccountBalanceDate(model)
      .subscribe({
        next: response => {
          this.balance = response.result + ' ' + this.current.replace(/'/g, '');
        },
        error: (error: any) => {
          this.alert('warning', 'No es posible generar el saldo', '');
        },
      });
  }

  // Establece los valores de movimientos de la cuenta seleccionada a la tabla
  searchDataAccount(cveAccount: string) {
    this.cveAccount = cveAccount;
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.dataAccountPaginated = cveAccount;
    this.recordAccountStatementsAccountsService
      .getDataAccount(cveAccount, params)
      .subscribe(
        (response: { data: any; count: any }) => {
          this.loading = true;
          const data = response.data;
          this.dataAccount.load(data);
          this.dataAccount.refresh();
          this.totalItems = response.count;
          this.loading = false;
        },
        (error: any) => (this.loading = false)
      );
    this.searchFactasStatusCta(cveAccount);
  }

  // Trae el nombre del banco y número de cuenta que se establece en el modal de transferencia
  searchFactasStatusCta(cveAccount: string) {
    this.recordAccountStatementsAccountsService
      .getFactasStatusCta(cveAccount)
      .subscribe({
        next: (response: any) => {
          this.factasStatusCta = response;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
        },
      });
  }

  // Abre el modal de transferencia de saldos
  openModal(movimentAccount: IRecordAccountStatements) {
    const nombre = this.itemSelected;
    const cveCta = this.accouncveAccount;
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      ignoreBackdropClick: false,
      movimentAccount: {
        nombre,
        cveCta,
        ...movimentAccount,
        factasStatusCta: this.factasStatusCta,
      },
      dataAccountPaginated: this.dataAccountPaginated,
      callback: (next: boolean) => {
        if (next) this.searchDataAccount(this.dataAccountPaginated);
        // if (next) this.getEvent();
      },
    };
    this.modalService.show(RecordAccountStatementsModalComponent, modalConfig);
    this.searchDataAccount(this.cveAccount);
    // this.getEvent();
  }

  searchCheck() {
    this.recordAccountStatementsAccountsService
      .getChecks(this.params.getValue())
      .subscribe({
        next: response => {
          (this.checks = response.data), response.count;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.alert('error', 'No Existen Cheques Devueltos', ``);
        },
      });
  }

  showDeleteAlert(movimentAccount: IRecordAccountStatements) {
    const modal = {
      numberAccount: movimentAccount.numberAccount,
      numberMotion: movimentAccount.numberMotion,
    };
    this.alertQuestion(
      'question',
      'Eliminar',
      '¿Desea Eliminar este Movimiento?'
    ).then((question: { isConfirmed: any }) => {
      if (question.isConfirmed) {
        this.delete(movimentAccount, modal);
      }
    });
  }

  delete(movimentAccount: IRecordAccountStatements, modal: any) {
    let showAlert = false;
    if (
      movimentAccount.genderTransfer !== null ||
      movimentAccount.numberMotionTransfer !== null ||
      movimentAccount.numberReturnPayCheck !== null ||
      movimentAccount.numberGood !== null ||
      movimentAccount.genderTransfer !== null
    ) {
      if (movimentAccount.genderTransfer === 'S') {
        this.alert(
          'warning',
          'No se puede eliminar el movimiento porque proviene de una transferencia',
          ``
        );
        showAlert = true;
      }
      if (movimentAccount.numberReturnPayCheck !== null) {
        this.alert(
          'warning',
          'No se puede eliminar el movimiento porque proviene de un cobro de cheque debido a una devolución',
          ``
        );
        showAlert = true;
      }
      if (movimentAccount.numberGood !== null) {
        this.alert(
          'warning',
          'No se puede eliminar el movimiento porque está asociado a un Bien',
          ``
        );
        showAlert = true;
      }
    }

    if (!showAlert) {
      const chequeEncontrado = this.checks.find(
        (cheque: { accountOriginDepositNumber: number }) =>
          cheque.accountOriginDepositNumber === movimentAccount.numberMotion
      );

      if (chequeEncontrado) {
        this.alert(
          'warning',
          'No se puede eliminar el movimiento mientras tenga devoluciones registradas',
          ``
        );
        showAlert = true;
      } else {
        this.recordAccountStatementsAccountsService.remove(modal).subscribe({
          next: (response: any) => {
            this.searchDataAccount(this.dataAccountPaginated);
            // this.getEvent();
            this.alert('success', 'Movimiento Eliminado', '');
          },
          error: (err: any) => {
            this.alert('error', 'No es posible eliminar el movimiento', '');
          },
        });
      }
    }
  }

  cleandInfoAll() {
    this.form.reset();
    this.totalItems = 0;
    this.getBanks(new ListParams());
    this.getEventNew(new ListParams());
    this.balance = null;
  }

  cleandInfo() {
    this.totalItems = 0;
    this.form.reset();
    this.getBanks(new ListParams());
    this.getEventNew(new ListParams());
  }

  cleandInfoDate() {
    this.form.get('balanceOf').reset();
    this.form.get('balanceAt').reset();
    this.balance = null;
  }
  getBanks(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    let params__ = '';
    if (lparams?.text.length > 0)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params__ = `?filter.cve_cuenta=${lparams.text}`;
        // params.addFilter('no_cuenta', lparams.text);
      } else {
        console.log('NO');

        params__ = `?filter.cve_banco=${lparams.text}`;
        // params.addFilter('cve_banco', lparams.text);
      }

    return new Promise((resolve, reject) => {
      this.accountMovementService.getDataBank(params__).subscribe({
        next: response => {
          let result = response.data.map(item => {
            item['bankAndNumber'] =
              item.cve_cuenta + ' - ' + item.cve_banco + ' - ' + item.nombre;
            this.itemSelected = item.cve_banco;
            this.accouncveAccount = item.cve_cuenta;
          });

          Promise.all(result).then((resp: any) => {
            this.banks = new DefaultSelect(response.data, response.count);
            this.loading = false;
          });
        },
        error: err => {
          this.banks = new DefaultSelect();
          console.log(err);
        },
      });
    });
  }

  getEventNew($params: ListParams) {
    //const area = this.form.controls['user'].value;
    // params.search = $params.text;
    this.getEvent($params);
  }

  getEvent(lparams?: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    let params__ = '';
    if (lparams?.text.length > 0)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('ACCOUNT-SI');
        params__ = `?filter.accountNumber.cveAccount=${lparams.text}`;
        // params.addFilter('no_cuenta', lparams.text);
      } else {
        console.log('ACCOUNT-NO');

        params__ = `?filter.accountNumber.cveAccount=${lparams.text}`;
        // params.addFilter('cve_banco', lparams.text);
      }
    return new Promise((resolve, reject) => {
      this.recordAccountStatementsAccountsService
        .getAccounts(params__)
        .subscribe({
          next: data => {
            data.data.map((item: any) => {
              item['accountAndNumber'] = item.accountNumber.cveAccount;
              this.newBank = item.accountNumber.cveBank;
            });
            // this.form.get('bankSelect').setValue(this.newBank);
            console.log(data.data);
            this.bankAccountSelect = new DefaultSelect(data.data, data.count);
          },
          error: () => {
            this.bankAccountSelect = new DefaultSelect();
          },
        });
    });
  }
}

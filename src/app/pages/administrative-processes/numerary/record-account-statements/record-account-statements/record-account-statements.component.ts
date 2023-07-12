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
  data: LocalDataSource = new LocalDataSource();

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
  bankCode: string;
  checks: any;

  paramsSubject: BehaviorSubject<ListParams> = new BehaviorSubject<ListParams>(
    new ListParams()
  );

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
    this.settings.actions.delete = true;
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
      balance: [null, Validators.nullValidator],
    });
  }

  ngOnInit(): void {
    this.prepareForm();
    this.searchBanks(new ListParams());
    this.searchCheck();
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
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params.value.page = 1;
          this.params = this.pageFilter(this.params);
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

  // Trae la lista de bancos por defecto
  searchBanks(params: ListParams) {
    this.loading = true;
    this.recordAccountStatementsService.getAll(params).subscribe({
      next: response => {
        this.loading = true;
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
    // this.dataAccount = new LocalDataSource();
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
    this.form.get('account').reset();
    this.form.get('accountType').reset();
    this.form.get('square').reset();
    this.form.get('branch').reset();
    this.form.get('currency').reset();
    this.form.get('description').reset();
    this.totalItems = 0;
    this.cleandInfoDate();
    this.bankAccountSelect = new DefaultSelect();
    this.loading = false;
    // this.dataAccount = new LocalDataSource();
    if (value && value.bankCode) {
      const bankCode = value.bankCode;
      this.searchBankAccount(bankCode, this.paramsSubject);
      this.loading = false;
    } else {
      this.cleandInfoAll();
      this.loading = false;
    }
  }

  // Toma el banco seleccionado y busca todas las cuentas pertenecientes a ese banco
  searchBankAccount(
    bankCode: string,
    paramsSubject: BehaviorSubject<ListParams>
  ) {
    this.bankCode = bankCode;
    const params = paramsSubject.getValue();
    this.recordAccountStatementsAccountsService
      .getById(bankCode, params)
      .subscribe({
        next: response => {
          this.bankAccountSelect = new DefaultSelect(
            response.data,
            response.count
          );
          this.loading = false;
        },
        // this.data.load(this.documents);
        error: (err: any) => {
          this.loading = false;
          this.alert('warning', 'No existen cuentas', ``);
        },
      });
  }

  onClearSelection() {
    this.searchBankAccount(this.bankCode, this.paramsSubject);
  }

  onSearchAccount(inputElement: any) {
    // this.dataAccount = new LocalDataSource();
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
    this.form.get('accountType').reset();
    this.form.get('square').reset();
    this.form.get('branch').reset();
    this.form.get('currency').reset();
    this.form.get('description').reset();
    this.totalItems = 0;
    this.cleandInfoDate();
    // this.dataAccount = new LocalDataSource();
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

  // Permite buscar la descripcion de la moneda
  searchCurrent(currency: string) {
    if (currency === `'M'`) {
      currency = 'PESO MEXICANO';
      this.form.get('description').setValue(currency);
    }
    this.tvalTable5Service.getCurrent(currency).subscribe({
      next: response => {
        let current = response.data;
        let currentAccount = current[0].otvalor02;
        this.form.get('description').setValue(currentAccount);
        this.loading = false;
      },
    });
  }

  // Genera el saldo de la cuenta seleccionada al escoger un rango de fechas
  DateAccountBalance() {
    const balanceOf = this.datePipe.transform(this.variableOf, 'dd/MM/yyyy');
    const balanceAt = this.datePipe.transform(this.variableAt, 'dd/MM/yyyy');

    if (!balanceOf && !balanceAt) {
      this.alert('warning', 'Error', 'Debe ingresar las fechas de saldo');
      return;
    } else if (!balanceOf) {
      this.alert('warning', 'Error', 'Debe ingresar la fecha de "Saldo de"');
      return;
    } else if (!balanceAt) {
      this.alert('warning', 'Error', 'Debe ingresar la fecha de "Saldo a:"');
      return;
    }

    const model: IDateAccountBalance = {
      noAccount: this.accountDate,
      tiDateCalc: balanceOf,
      tiDateCalcEnd: balanceAt,
    };

    this.recordAccountStatementsAccountsService
      .getAccountBalanceDate(model)
      .subscribe({
        next: response => {
          this.balance = response.result + ' ' + this.current.replace(/'/g, '');
        },
        error: error => {
          this.alert('warning', 'Error', 'No es posible generar el saldo');
        },
      });
  }

  // Establece los valores de movimientos de la cuenta seleccionada a la tabla
  searchDataAccount(accountNumber: number) {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.dataAccountPaginated = accountNumber;
    this.recordAccountStatementsAccountsService
      .getDataAccount(accountNumber, params)
      .subscribe({
        next: response => {
          this.loading = true;
          const data = response.data.map(item => {
            const dateParts = item.dateMotion.split('-');
            const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            return { ...item, dateMotion: formattedDate };
          });
          this.dataAccount.load(data);
          this.dataAccount.refresh();
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

  // Abre el modal de transferencia de saldos
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
          this.alert('warning', 'No existen cheques devueltos', ``);
        },
      });
  }

  showDeleteAlert(movimentAccount: IRecordAccountStatements) {
    const modal = {
      numberAccount: movimentAccount.numberAccount,
      numberMotion: movimentAccount.numberMotion,
    };
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este movimiento?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(movimentAccount, modal);
      }
    });
  }

  delete(movimentAccount: IRecordAccountStatements, modal: any) {
    let showAlert = false;

    if (
      movimentAccount.numberMotionTransfer !== null ||
      movimentAccount.numberReturnPayCheck !== null ||
      movimentAccount.numberGood !== null ||
      movimentAccount.genderTransfer !== null
    ) {
      if (movimentAccount.numberMotionTransfer !== null) {
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
          'No se puede eliminar el movimiento porque está asociado a un bien',
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
          next: response => {
            this.searchDataAccount(this.dataAccountPaginated);
            this.alert('success', 'Movimiento eliminado', '');
          },
          error: err => {
            this.alert('error', 'No es posible eliminar el movimiento', '');
          },
        });
      }
    }
  }

  cleandInfoAll() {
    this.form.reset();
    this.dataAccount = new LocalDataSource();
    this.totalItems = 0;
    this.searchBanks(new ListParams());
    this.balance = null;
  }

  cleandInfo() {
    this.dataAccount = new LocalDataSource();
    this.totalItems = 0;
    this.form.reset();
    this.searchBanks(new ListParams());
  }

  cleandInfoDate() {
    this.form.get('balanceOf').reset();
    this.form.get('balanceAt').reset();
    this.balance = null;
  }
}

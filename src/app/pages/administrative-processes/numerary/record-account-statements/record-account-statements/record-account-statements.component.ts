import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BankService } from 'src/app/core/services/catalogs/bank.service';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { RecordAccountStatementsModalComponent } from '../record-account-statements-modal/record-account-statements-modal.component';
import { RECORDS_ACCOUNT_STATEMENTS_COLUMNS } from './record-account-statements-columns';

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

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private bankService: BankService,
    private bankAccountService: BankAccountService,
    private render: Renderer2
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: RECORDS_ACCOUNT_STATEMENTS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getBancos(new ListParams());
  }
  prepareForm() {
    this.form = this.fb.group({
      bank: [null, Validators.required],
      account: [null, Validators.required],
      square: [null, Validators.nullValidator],
      branch: [null, Validators.nullValidator],
      accountType: [null, Validators.nullValidator],
      currency: [null, Validators.nullValidator],
      description: [null, Validators.nullValidator],
      balanceOf: [null, Validators.nullValidator],
      balanceAt: [null, Validators.nullValidator],
      total: [null, Validators.nullValidator],
    });
    const fieldsquare = document.getElementById('square');
    const fieldbranch = document.getElementById('branch');
    const fieldaccount = document.getElementById('account');
    const fieldcurrency = document.getElementById('currency');
    const fielddescription = document.getElementById('description');

    this.render.addClass(fieldsquare, 'disabled');
    this.render.addClass(fieldbranch, 'disabled');
    this.render.addClass(fieldaccount, 'disabled');
    this.render.addClass(fieldcurrency, 'disabled');
    this.render.addClass(fielddescription, 'disabled');
  }
  openForm(data?: any) {
    // const modalConfig = MODAL_CONFIG;
    // modalConfig.initialState = {
    //   data,
    //   callback: (next: boolean) => {
    //     if (next) this.getAttributes();
    //   },
    // };
    // this.modalService.show(RecordAccountStatementsModalComponent, modalConfig);
  }

  selectData(data: any) {
    if (data.deposit != null) {
      this.warningAlert(
        'No es posible hacer movimientos intercuentas para aquellos que sean abonos'
      );
      return;
    }
    if (data.genero_transferencia == 'S') {
      this.warningAlert('Ese movimiento ya ha sido transferido');
      return;
    }
    if (this.form.get('bank').value == null) {
      this.warningAlert('Debe especificar primero la cuenta a ser cerrada');
      return;
    }
    if (data.accountNumber.accountNumberTransfer == null) {
      this.warningAlert('No tiene una cuenta para transferir');
      return;
    }
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      data,
      callback: (next: boolean) => {
        if (next) this.getFiltroData(data.accountNumber.accountNumber);
      },
    };
    this.modalService.show(RecordAccountStatementsModalComponent, modalConfig);
  }

  getBancos(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    this.bankService.getAll(params).subscribe((data: any) => {
      this.itemsBancos = new DefaultSelect(data.data, data.count);
    });
  }

  getCuentas(params: ListParams, id?: string) {
    this.itemsCuentas = new DefaultSelect([], 0);
    if (id) {
      params['filter.cveBank'] = `$eq:${id}`;
    }
    this.bankAccountService.getAll(params).subscribe((data: any) => {
      this.itemsCuentas = new DefaultSelect(data.data, data.count);
    });
  }

  getFiltroData(id?: string) {
    this.totalItems = 0;
    this.loading = true;
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
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
          this.params = this.pageFilter(this.params);
          this.getData(id);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData(id));
  }

  getData(id?: string) {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (id) {
      params['filter.numberAccount'] = `$eq:${id}`;
    }
    this.bankAccountService.getAllWithFiltersAccount(params).subscribe({
      next: async (response: any) => {
        this.totalItems = response.count;
        this.data1.load(response.data);
        this.data1.refresh();
        this.loading = false;
      },
      error: err => {},
    });
    this.loading = false;
  }

  ChangeBanco(event: any) {
    this.form.get('account').setValue('');
    this.form.get('square').setValue('');
    this.form.get('branch').setValue('');
    this.form.get('accountType').setValue('');
    this.form.get('currency').setValue('');
    this.validation = false;
    this.getCuentas(new ListParams(), event.bankCode);
    this.totalItems = 0;
    this.data1.load([]);
    this.data1.refresh();
  }

  ChangeCuenta(event: any) {
    console.log('DATAAA', event);
    this.form.get('square').setValue(event.square);
    this.form.get('branch').setValue(event.branch);
    this.form.get('accountType').setValue(event.accountType);
    this.form.get('currency').setValue(event.cveCurrency);
    this.validation = false;
    this.totalItems = 0;
    this.data1.load([]);
    this.data1.refresh();
    this.getFiltroData(event.accountNumber);
  }

  search() {
    if (this.form.get('account').value != null) {
      const payload = {
        noAccount: this.form.get('account').value,
        tiDateCalc: this.form.get('balanceAt').value,
        tiDateCalcEnd: this.form.get('balanceOf').value,
      };
      this.bankAccountService.getStatusCta(payload).subscribe({
        next: async (response: any) => {
          this.form.get('total').setValue(response.result);
          this.validation = true;
        },
        error: err => {
          this.loading = false;
        },
      });
    } else {
      this.warningAlert('Debe seleccionar una cuenta');
    }
  }
  warningAlert(message: any) {
    this.alert('warning', message, '');
  }
}

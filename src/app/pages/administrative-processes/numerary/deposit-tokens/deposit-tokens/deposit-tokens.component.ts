import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DepositTokensModalComponent } from '../deposit-tokens-modal/deposit-tokens-modal.component';
import { DEPOSIT_TOKENS_COLUMNS } from './deposit-tokens-columns';
@Component({
  selector: 'app-deposit-tokens',
  templateUrl: './deposit-tokens.component.html',
  styles: [],
})
export class DepositTokensComponent extends BasePage implements OnInit {
  form: FormGroup;

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private accountMovementService: AccountMovementService,
    private datePipe: DatePipe,
    private readonly goodServices: GoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: DEPOSIT_TOKENS_COLUMNS,
      rowClassFunction: (row: any) => {
        if (row.data.no_bien != null) {
          return 'bg-warning text-black';
        } else {
          return '';
        }
      },
    };

    // this.settings.rowClassFunction = async (row: any) => {

    // };
  }

  ngOnInit(): void {
    this.prepareForm();

    this.filter1.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getAccount();
    });
  }

  getAccount() {
    this.loading = true;
    this.accountMovementService
      .getAccount2(this.filter1.getValue().getParams())
      .subscribe({
        next: async (response: any) => {
          let result = response.data.map(async (item: any) => {
            const detailsBank: any = await this.returnDataBank(item.no_cuenta);

            item['currency'] = detailsBank ? detailsBank.cveCurrency : null;
            item['bank'] = detailsBank ? detailsBank.cveBank : null;
            item['cveAccount'] = detailsBank ? detailsBank.cveAccount : null;
            item['fec_insercion_'] = item.fec_insercion
              ? this.datePipe.transform(item.fec_insercion, 'dd/MM/yyyy')
              : null;
            item['fec_traspaso_'] = item.fec_traspaso
              ? this.datePipe.transform(item.fec_traspaso, 'dd/MM/yyyy')
              : null;
            item['bancoDetails'] = detailsBank ? detailsBank : null;
          });

          Promise.all(result).then((resp: any) => {
            this.data1 = response.data;
            this.totalItems = response.count;
            console.log(response);
            this.loading = false;
          });
        },
        error: err => {
          this.loading = false;
        },
      });
  }

  async returnDataBank(id: any) {
    const params = new ListParams();
    params['filter.accountNumber'] = `$eq:${id}`;

    return new Promise((resolve, reject) => {
      this.accountMovementService.getAccountBank(params).subscribe({
        next: response => {
          resolve(response.data[0]);
        },
        error: err => {
          resolve(null);
          console.log(err);
        },
      });
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      descriptionGood: [null, Validators.nullValidator],
      bank: [null, Validators.nullValidator],
      account: [null, Validators.nullValidator],
      accountType: [null, Validators.nullValidator],
      currency: [null, Validators.nullValidator],
      square: [null, Validators.nullValidator],
      description: [null, Validators.nullValidator],
      branch: [null, Validators.nullValidator],
      balanceOf: [null, Validators.nullValidator],
      balanceAt: [null, Validators.nullValidator],
    });
  }
  onCustomAction(event: any) {
    console.log('data', event);
    if (event.data.no_bien) {
      this.getDetailsGood(event.data.no_bien);
    } else {
      this.form.get('descriptionGood').setValue('');
    }

    if (event.data.bancoDetails) {
      this.insertDataBank(event.data.bancoDetails);
    }
  }

  insertDataBank(bank: any) {
    this.form.get('bank').setValue(bank.banco.name);
    this.form.get('account').setValue(bank.cveAccount);
    this.form.get('accountType').setValue(bank.accountType);
    this.form.get('currency').setValue(bank.cveCurrency);
    this.form.get('square').setValue(bank.square);
    this.form.get('description').setValue('');
    this.form.get('branch').setValue(bank.branch);
    this.form.get('balanceOf').setValue('');
    this.form.get('balanceAt').setValue('');
  }

  getAttributes() {
    // this.loading = true;
    // this.attributesInfoFinancialService
    //   .getAll(this.params.getValue())
    //   .subscribe({
    //     next: response => {
    //       this.attributes = response.data;
    //       this.totalItems = response.count;
    //       this.loading = false;
    //     },
    //     error: error => (this.loading = false),
    //   });
  }

  getDetailsGood(id: any) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    this.goodServices.getByExpedientAndParams__(params).subscribe({
      next: async (response: any) => {
        this.form.get('descriptionGood').setValue(response.data[0].description);
      },
      error: err => {
        this.form.get('descriptionGood').setValue('');
      },
    });
  }
  openForm(data?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      data,
      callback: (next: boolean) => {
        if (next) this.getAttributes();
      },
    };
    this.modalService.show(DepositTokensModalComponent, modalConfig);
  }
}

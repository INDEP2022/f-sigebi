import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IOrderPayment } from 'src/app/core/models/ms-order-service/order-payment.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { BasePage, TABLE_SETTINGS } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  CREDIT_NOTS_COLUMNS,
  ORDER_SERVICE_ORDER_COLUMNS,
} from '../report-consolidated-entry-order/report-consolidated-entry-order-columns';
import { ShowDeductivesFormComponent } from '../show-deductives-form/show-deductives-form.component';
import { PAYMENT_ORDER_COLUMNS } from './report-consolidated-columns';

@Component({
  selector: 'app-report-consolidated-payment-order',
  templateUrl: './report-consolidated-payment-order.component.html',
  styleUrls: ['../report-good/report-good.component.scss'],
})
export class ReportConsolidatedPaymentOrderComponent
  extends BasePage
  implements OnInit
{
  showSearchForm: boolean = true;
  formLoading: boolean = false;
  loadingOrderService: boolean = false;
  loadingCreditNots: boolean = false;
  paymentsOrder = new LocalDataSource();
  OrderService = new LocalDataSource();
  creditNots = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsOrderService = new BehaviorSubject<ListParams>(new ListParams());
  paramsCreditsNots = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  totalItemsOrderService: number = 0;
  totalItemsCreditsNots: number = 0;
  form: FormGroup = new FormGroup({});
  searchForm: FormGroup = new FormGroup({});
  regionalsDelegations = new DefaultSelect();
  transferences = new DefaultSelect();

  settingsOrderService = {
    ...TABLE_SETTINGS,
    selectMode: 'multi',
    actions: false,
    columns: ORDER_SERVICE_ORDER_COLUMNS,
  };

  settingsCreditsNots = {
    ...TABLE_SETTINGS,
    selectMode: 'multi',
    actions: false,
    columns: CREDIT_NOTS_COLUMNS,
  };

  constructor(
    private fb: FormBuilder,
    private regionalDelegationService: RegionalDelegationService,
    private transferentService: TransferenteService,
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private orderServiceService: OrderServiceService,
    private authService: AuthService
  ) {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      selectMode: 'multi',
      actions: false,
      columns: PAYMENT_ORDER_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getRegionalDelegationSelect(new ListParams());
    this.getTransferentSelect(new ListParams());
  }

  prepareForm() {
    this.form = this.fb.group({
      orderPayDate: [null],
      conditionsPay: [null],
      delegationName: [null],
      Subtotal: [null],
      instructionsspecials: [null],
      amountvat: [null],
      transferentName: [null],
      contractNumber: [null],
      description: [null],
    });

    this.searchForm = this.fb.group({
      idOrderPayment: [null],
      cveZone: [null],
      regionalDelegationNumber: [null],
      tranferId: [null],
      noContract: [null],
    });
  }

  getRegionalDelegationSelect(params: ListParams) {
    params['sortBy'] = 'description:ASC';
    this.regionalDelegationService.getAll(params).subscribe({
      next: response => {
        this.regionalsDelegations = new DefaultSelect(
          response.data,
          response.count
        );
      },
      error: () => {
        this.regionalsDelegations = new DefaultSelect();
      },
    });
  }

  getTransferentSelect(params: ListParams) {
    params['sortBy'] = 'nameTransferent:ASC';
    params['filter.status'] = `$eq:${1}`;
    this.transferentService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          data.nameAndId = `${data.id} - ${data.nameTransferent}`;
          return data;
        });
        this.transferences = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.transferences = new DefaultSelect();
      },
    });
  }

  showDeductives() {
    let config = { ...MODAL_CONFIG, class: 'modal-xl modal-dialog-centered' };

    config.initialState = {
      callback: (next: boolean) => {},
    };

    this.modalService.show(ShowDeductivesFormComponent, config);
  }

  search() {
    const idOrderPayment = this.searchForm.get('idOrderPayment').value;
    const cveZone = this.searchForm.get('cveZone').value;
    const regionalDelegationNumber = this.searchForm.get(
      'regionalDelegationNumber'
    ).value;
    const tranferId = this.searchForm.get('tranferId').value;
    const noContract = this.searchForm.get('noContract').value;
    if (idOrderPayment) this.params.getValue()['filter.id'] = idOrderPayment;
    if (cveZone) this.params.getValue()['filter.zoneKey'] = cveZone;
    if (regionalDelegationNumber)
      this.params.getValue()['filter.delegationRegionalId'] =
        regionalDelegationNumber;
    if (tranferId) this.params.getValue()['filter.transfereeId'] = tranferId;
    if (noContract)
      this.params.getValue()['filter.contractNumber'] = noContract;

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getOrderPayment());
  }

  getOrderPayment() {
    this.loading = true;
    this.orderServiceService.getOrderPayment(this.params.getValue()).subscribe({
      next: response => {
        const info = response.data.map(async item => {
          const transferentName: any = await this.getTransferentName(
            item.transfereeId
          );
          const delegationName: any = await this.getDelegationName(
            item.delegationRegionalId
          );
          item.transferentName = transferentName;
          item.delegationName = delegationName;
          item.orderPayDate = moment(item.orderPayDate).format('DD/MM/YYYY');
          return item;
        });

        Promise.all(info).then(info => {
          this.paymentsOrder.load(info);
          this.totalItems = response.count;
          this.loading = false;
        });
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  getOrderService() {
    const token = this.authService.decodeToken();
    this.paramsOrderService.getValue()[
      'filter.delegation'
    ] = `$eq: ${token.department}`;
    this.orderServiceService
      .getAllOrderService(this.paramsOrderService.getValue())
      .subscribe({
        next: response => {
          const info = response.data.map(async item => {
            const transferentName: any = await this.getTransferentName(
              item.transferee
            );

            item.transferentName = transferentName;
            return item;
          });

          Promise.all(info).then(info => {
            console.log('info', info);
            this.OrderService.load(info);
            this.totalItemsOrderService = response.count;
          });
        },
        error: () => {},
      });
  }

  getTransferentName(id: number) {
    return new Promise((resolve, reject) => {
      this.transferentService.getById(id).subscribe({
        next: response => {
          resolve(response.nameTransferent);
        },
        error: () => {
          resolve('SIN TRANSFERENTE');
        },
      });
    });
  }

  getDelegationName(id: number) {
    return new Promise((resolve, reject) => {
      this.regionalDelegationService.getById(id).subscribe({
        next: response => {
          resolve(response.description);
        },
        error: () => {
          resolve('SIN DELEGACIÓN');
        },
      });
    });
  }

  orderPaymentSelect(orderPayment: IOrderPayment) {
    console.log('orderPayment', orderPayment);
    this.form.patchValue(orderPayment);
    this.paramsOrderService
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getOrderService());
  }

  cleanForm() {
    this.searchForm.reset();
    this.params = new BehaviorSubject<ListParams>(new ListParams());
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getOrderPayment());
  }
}

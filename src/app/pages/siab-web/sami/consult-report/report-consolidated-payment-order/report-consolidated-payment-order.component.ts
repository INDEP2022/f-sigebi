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
import { orderentryService } from 'src/app/core/services/ms-comersale/orderentry.service';
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
  orderService = new LocalDataSource();
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
  orderPaySelect: IOrderPayment[] = [];
  settingsOrderService = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: ORDER_SERVICE_ORDER_COLUMNS,
  };

  settingsCreditsNots = {
    ...TABLE_SETTINGS,
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
    private authService: AuthService,
    private orderEntryService: orderentryService
  ) {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: PAYMENT_ORDER_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getRegionalDelegationSelect(new ListParams());
    this.getTransferentSelect(new ListParams());
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getOrderPayment());
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
    let delSelect: boolean = false;
    let transferentSelect: boolean = false;
    let contractSelect: boolean = false;

    if (this.orderPaySelect.length > 0) {
      const delegationRegionalFilter = this.orderPaySelect.filter(
        (item: any) => {
          if (
            item.delegationRegionalId ==
            this.orderPaySelect[0].delegationRegionalId
          )
            return item;
        }
      );

      if (delegationRegionalFilter.length == this.orderPaySelect.length) {
        delSelect = true;
      }

      const transferentFilter = this.orderPaySelect.filter((item: any) => {
        if (item.transfereeId == this.orderPaySelect[0].transfereeId)
          return item;
      });

      if (transferentFilter.length == this.orderPaySelect.length) {
        transferentSelect = true;
      }

      const contFilter = this.orderPaySelect.filter((item: any) => {
        if (item.contractNumber == this.orderPaySelect[0].contractNumber)
          return item;
      });

      if (contFilter.length == this.orderPaySelect.length) {
        contractSelect = true;
      }

      if (delSelect && transferentSelect && contractSelect) {
        let folios: string = '';
        let total: number = 0;
        this.orderPaySelect.map((item: any) => {
          if (item.applicationpreorderPayId) {
            folios += `${item.applicationpreorderPayId}, `;
            total = Number(item.total) + Number(item.total);
          }
        });

        let config = {
          ...MODAL_CONFIG,
          class: 'modal-xl modal-dialog-centered',
        };

        config.initialState = {
          folio: folios,
          total: total,
          delegationId: this.orderPaySelect[0].delegationRegionalId,
          transferentId: this.orderPaySelect[0].transfereeId,
          contractNumber: this.orderPaySelect[0].contractNumber,
          callback: (next: boolean) => {
            if (next) {
              this.paramsCreditsNots
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe(() => this.getCreditsNots());
            }
          },
        };

        this.modalService.show(ShowDeductivesFormComponent, config);
      } else {
        this.alert(
          'warning',
          'Acción Invalida',
          'Las ordenes de pago seleccionadas deben de ser de la misma transferente, delegación regional y para el mismo contrato'
        );
      }
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se debe seleccionar al menos una orden de pago'
      );
    }
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
    const user: any = this.authService.decodeToken();
    this.params.getValue()[
      'filter.delegationRegionalId'
    ] = `$eq:${user.department}`;
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
          item.billSupplierDate = moment(item.billSupplierDate).format(
            'DD/MM/YYYY'
          );
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
    //const token = this.authService.decodeToken();
    this.paramsOrderService.getValue()[
      'filter.orderentryDedId'
    ] = `$eq: ${this.orderPaySelect[0].id}`;
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
            this.orderService.load(info);
            this.totalItemsOrderService = response.count;
          });
        },
        error: () => {
          this.orderService = new LocalDataSource();
          this.totalItemsOrderService = 0;
        },
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

  orderPaymentSelect(orderPayment: IOrderPayment[]) {
    this.orderPaySelect = orderPayment;
    console.log('orderPayment', orderPayment[0]);
    /*orderPayment[0].orderPayDate = moment(orderPayment[0].orderPayDate).format(
      'DD/MM/YYYY'
    ); */
    this.form.patchValue(orderPayment[0]);

    this.paramsOrderService
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getOrderService());

    this.paramsCreditsNots
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCreditsNots());
  }

  getCreditsNots() {
    this.loadingCreditNots = true;
    this.paramsCreditsNots.getValue()[
      'filter.orderPayId'
    ] = `$eq:${this.orderPaySelect[0].id}`;

    this.orderEntryService
      .getCreditNots(this.paramsCreditsNots.getValue())
      .subscribe({
        next: response => {
          this.creditNots.load(response.data);
          this.totalItemsCreditsNots = response.count;
          this.loadingCreditNots = false;
        },
        error: () => {
          this.loadingCreditNots = false;
          this.creditNots = new LocalDataSource();
          this.totalItemsCreditsNots = 0;
        },
      });
  }

  cleanForm() {
    this.searchForm.reset();
    this.form.reset();

    this.params = new BehaviorSubject<ListParams>(new ListParams());
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getOrderPayment());

    this.paymentsOrder = new LocalDataSource();
    this.orderService = new LocalDataSource();
    this.creditNots = new LocalDataSource();
    this.totalItemsCreditsNots = 0;
    this.totalItemsOrderService = 0;
    this.totalItems = 0;
  }
}

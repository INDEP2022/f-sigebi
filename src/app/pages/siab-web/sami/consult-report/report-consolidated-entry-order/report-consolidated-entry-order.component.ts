import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IOrderEntry } from 'src/app/core/models/ms-order-entry/order-entry.model';
import { IOrderPayment } from 'src/app/core/models/ms-order-service/order-payment.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { orderentryService } from 'src/app/core/services/ms-comersale/orderentry.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  DETAIL_GOODS_COLUMNS,
  DETAIL_GOODS_ORDER_ENTRY_COLUMNS,
  ORDER_PAY_COLUMNS,
  ORDER_SERVICE_COLUMNS,
  SERVICES_COLUMNS,
} from './report-consolidated-entry-order-columns';

@Component({
  selector: 'app-report-consolidated-entry-order',
  templateUrl: './report-consolidated-entry-order.component.html',
  styleUrls: ['../report-good/report-good.component.scss'],
})
export class ReportConsolidatedEntryOrderComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsDetailGoodsProgDel = new BehaviorSubject<ListParams>(new ListParams());
  paramsDetailGoodsOrdEnt = new BehaviorSubject<ListParams>(new ListParams());
  paramsServices = new BehaviorSubject<ListParams>(new ListParams());
  paramsOrderAs = new BehaviorSubject<ListParams>(new ListParams());
  infoOrderService = new LocalDataSource();
  infoDetailGoodsProgDel = new LocalDataSource();
  infoDetailGoodsOrdEntry = new LocalDataSource();
  infoOrderServices = new LocalDataSource();
  infoOrderAs = new LocalDataSource();
  totalItems: number = 0;
  totalItemsDetailGoodsProgDel: number = 0;
  totalItemsDetailGoodsOrdEnt: number = 0;
  totalItemsService: number = 0;
  totalItemsOrderAs: number = 0;
  orderServiceId: number = 0;
  loadingServices: boolean = false;
  loadingDetailGoodsProgDel: boolean = false;
  loadingDetailGoodsOrdEntry: boolean = false;
  loadingOrderAs: boolean = false;
  showSearchForm: boolean = true;
  form: FormGroup = new FormGroup({});
  searchForm: FormGroup = new FormGroup({});
  regionalsDelegations = new DefaultSelect();

  settingsDetailGoodsProgDel = {
    ...this.settings,
    actions: false,
    columns: {
      ...DETAIL_GOODS_COLUMNS,
    },
  };

  settingsDetailGoodsOrderEnt = {
    ...this.settings,
    actions: false,
    columns: {
      ...DETAIL_GOODS_ORDER_ENTRY_COLUMNS,
    },
  };

  settingsServices = {
    ...this.settings,
    actions: false,
    columns: {
      ...SERVICES_COLUMNS,
    },
  };

  settingsOrderAs = {
    ...this.settings,
    actions: false,
    columns: {
      ...ORDER_PAY_COLUMNS,
    },
  };

  constructor(
    private fb: FormBuilder,
    private regionalDelegationService: RegionalDelegationService,
    private orderEntryService: orderentryService,
    private programmingGoodService: ProgrammingGoodService,
    private orderServiceService: OrderServiceService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        ...ORDER_SERVICE_COLUMNS,
      },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getRegionalDelegationSelect(new ListParams());
  }

  prepareForm() {
    this.form = this.fb.group({
      orderPayDate: [null],
      areaApplicant: [null],
      addressAreaApplication: [null],
      beneficiary: [null],
      operationType: [null],
      description: [null],
      awardType: [null],
      conditionsPay: [null],
      nameelaborate: [null],
      instructionsspecials: [null],
      contractNumber: [null],
      total: [null],
    });

    this.searchForm = this.fb.group({
      idOrderEntry: [null],
      startDate: [null],
      endDate: [null],
      regionalDelegationNumber: [null],
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

  search() {
    const idOrderEntry = this.searchForm.get('idOrderEntry').value;
    const startDate = this.searchForm.get('startDate').value;
    const endDate = this.searchForm.get('endDate').value;
    const regionalDelegationNumber = this.searchForm.get(
      'regionalDelegationNumber'
    ).value;
    const noContract = this.searchForm.get('noContract').value;

    if (idOrderEntry)
      this.params.getValue()['filter.id'] = `$eq:${idOrderEntry}`;
    if (startDate)
      this.params.getValue()['filter.startDate'] = `$eq:${startDate}`;
    if (endDate) this.params.getValue()['filter.endDate'] = `$eq:${endDate}`;
    if (regionalDelegationNumber)
      this.params.getValue()[
        'filter.delegationRegionalId'
      ] = `$eq:${regionalDelegationNumber}`;
    if (noContract)
      this.params.getValue()['filter.contractNumber'] = `$eq:${noContract}`;

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getOrderEntry());
  }

  getOrderEntry() {
    this.loading = true;
    this.orderEntryService.getAllOrderEntry(this.params.getValue()).subscribe({
      next: response => {
        this.infoOrderService.load(response.data);
        this.totalItems = response.count;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  orderEntrySelect(orderService: IOrderEntry) {
    this.orderServiceId = orderService.id;
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.orderEntryId'] = `$eq:${orderService.id}`;
    this.orderEntryService.getAllGoodOrderEntry(params.getValue()).subscribe({
      next: response => {
        const filterProgDelivery = response.data.filter((item: any) => {
          if (item.programmingDeliveryId) {
            return item;
          }
        });

        const paramsProgDel = new BehaviorSubject<ListParams>(new ListParams());
        this.loadingDetailGoodsProgDel = true;
        filterProgDelivery.map(itemData => {
          /*paramsProgDel.getValue()['filter.programmingDeliveryId'] = item.programmingDeliveryId; */
          paramsProgDel.getValue()['filter.programmingDeliveryId'] = 16896;
          this.programmingGoodService
            .getProgrammingDeliveryGood(paramsProgDel.getValue())
            .subscribe({
              next: response => {
                const info = response.data.map(item => {
                  item.cost = itemData.cost;
                  item.orderEntryId = itemData.orderEntryId;
                  item.transaction = itemData.transactionId;

                  return item;
                });

                this.infoDetailGoodsProgDel.load(info);
                this.totalItemsDetailGoodsProgDel = response.count;
                this.loadingDetailGoodsProgDel = false;
              },
              error: () => {
                this.loadingDetailGoodsProgDel = false;
              },
            });
        });
      },
      error: () => {},
    });

    this.paramsOrderAs
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getOrderPayment());
  }

  getOrderPayment() {
    this.loadingOrderAs = true;
    this.orderServiceService
      .getOrderPayment(this.paramsOrderAs.getValue())
      .subscribe({
        next: response => {
          this.infoOrderAs.load(response.data);
          this.totalItemsOrderAs = response.count;
          this.loadingOrderAs = false;
        },
        error: () => {},
      });
  }

  orderPaySelect(orderPayment: IOrderPayment) {
    this.form.patchValue(orderPayment);
  }

  cleanForm() {
    this.searchForm.reset();
    this.params = new BehaviorSubject<ListParams>(new ListParams());
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getOrderEntry());
  }
}

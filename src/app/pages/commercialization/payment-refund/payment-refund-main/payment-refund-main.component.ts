import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { PaymentDevolutionService } from 'src/app/core/services/ms-paymentdevolution/payment-services.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TableCheckboxComponent } from '../../massive-conversion/components/table-checkbox/table-checkbox.component';
import { ChangeRfcModalComponent } from './change-rfc-modal/change-rfc-modal.component';
import { CreateControlModalComponent } from './create-control-modal/create-control-modal.component';
import { CreationPermissionsModalComponent } from './creation-permissions-modal/creation-permissions-modal.component';
import { KeyChangeModalComponent } from './key-change-modal/key-change-modal.component';
import {
  BANK_ACCOUNTS_COLUMNS,
  PAYMENT_COLUMNS,
  REFUND_CONTROL_COLUMNS,
  RELATED_EVENT_COLUMNS,
} from './payment-refund-columns';
import { TransferDateModalComponent } from './transfer-date-modal/transfer-date-modal.component';

@Component({
  selector: 'app-payment-refund-main',
  templateUrl: './payment-refund-main.component.html',
  styles: [],
  animations: [
    trigger('OnInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('350ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class PaymentRefundMainComponent extends BasePage implements OnInit {
  layout: string = 'MAIN'; // 'MAIN', 'EXPENSE REQUEST', 'MAINTENANCE'
  @ViewChild('refundTabs', { static: false }) refundTabs?: TabsetComponent;
  @ViewChild('tabsContainer', { static: false }) tabsContainer: ElementRef;
  // Control Table
  dataTableControl: LocalDataSource = new LocalDataSource();
  dataTableParamsControl = new BehaviorSubject<ListParams>(new ListParams());
  loadingControl: boolean = false;
  totalControl: number = 0;
  totalControl_Count: number = 0;
  testDataControl: any[] = [];
  columnFiltersControl: any = [];
  // Control Table
  dataTableRelationEvent: LocalDataSource = new LocalDataSource();
  dataTableParamsRelationEvent = new BehaviorSubject<ListParams>(
    new ListParams()
  );
  loadingRelationEvent: boolean = false;
  totalRelationEvent: number = 0;
  testDataRelationEvent: any[] = [];
  columnFiltersRelationEvent: any = [];
  // Control Bank
  dataTableBank: LocalDataSource = new LocalDataSource();
  dataTableParamsBank = new BehaviorSubject<ListParams>(new ListParams());
  loadingBank: boolean = false;
  totalBank: number = 0;
  testDataBank: any[] = [];
  columnFiltersBank: any = [];
  //
  controlForm: FormGroup = new FormGroup({});
  selectedAccounts: any[] = [];
  selectedPayment: any[] = [];
  eventsTotalQuantity: number = 0;
  eventsTotalAmount: number = 0;
  accountsTotalQuantity: number = 0;
  accountsTotalAmount: number = 0;
  paymentsTotalAmount: number = 0;
  controlParams = new BehaviorSubject<ListParams>(new ListParams());
  eventParams = new BehaviorSubject<ListParams>(new ListParams());
  accountParams = new BehaviorSubject<ListParams>(new ListParams());
  paymentParams = new BehaviorSubject<ListParams>(new ListParams());
  controlTotalItems: number = 0;
  eventTotalItems: number = 0;
  accountTotalItems: number = 0;
  paymentTotalItems: number = 0;
  controlColumns: any[] = [];
  eventColumns: any[] = [];
  accountColumns: any[] = [];
  paymentColumns: any[] = [];
  controlSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    hideSubHeader: false,
  };
  eventSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    hideSubHeader: false,
  };
  accountSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    // selectMode: 'multi',
  };
  paymentSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };

  controlTestData = [
    {
      id: 100,
      key: 'LP DE MUEBLES 07/18',
      status: 'PROC',
      dispersion: 'M',
      dispersionType: 'Por Cliente',
      origin: 'Ganadores',
      createDate: '02/08/2019',
      endDate: '07/11/2019',
    },
    {
      id: 101,
      key: 'SMM 07/18',
      status: 'PROC',
      dispersion: 'M',
      dispersionType: 'Por Cliente',
      origin: 'Ganadores',
      createDate: '02/08/2019',
      endDate: '07/11/2019',
    },
    {
      id: 102,
      key: 'LP DE MUEBLES 07/18',
      status: 'PROC',
      dispersion: 'M',
      dispersionType: 'Por Cliente',
      origin: 'Ganadores',
      createDate: '02/08/2019',
      endDate: '07/11/2019',
    },
  ];

  eventTestData = [
    {
      id: 17268,
      cve: 'LP DE MUEBLES 07/18',
      quantity: 4,
      amount: 543950,
    },
    {
      id: 17269,
      cve: 'SMM 07/18',
      quantity: 5,
      amount: 516349,
    },
  ];

  accountTestData = [
    {
      status: 'FIS',
      cve: 'BANAMEX PS',
      account: '7007-1894728',
      quantity: 67,
      amount: 335000,
      expenseId: 20397,
      paymentId: 10137,
      folioNumber: 13475,
      paymentDate: '04/09/2021',
      checkNumber: 1649821,
      observations: 'OBSERVATIONS TEST DATA',
    },
    {
      status: 'CNT',
      cve: 'BANCOM PS',
      account: '1317652',
      quantity: 186,
      amount: 930000,
      expenseId: 20398,
      paymentId: 10138,
      folioNumber: 13476,
      paymentDate: '04/09/2021',
      checkNumber: 1649822,
      observations: 'OBSERVATIONS TEST DATA',
    },
    {
      status: 'PTO',
      cve: 'HSBC PS',
      account: '4047451869',
      quantity: 37,
      amount: 185000,
      expenseId: 20399,
      paymentId: 10139,
      folioNumber: 13477,
      paymentDate: '04/09/2021',
      checkNumber: 1649823,
      observations: 'OBSERVATIONS TEST DATA',
    },
    {
      status: 'TSR',
      cve: 'SANTAND PS',
      account: '655034287821',
      quantity: 2,
      amount: 10000,
      expenseId: 20400,
      paymentId: 10140,
      folioNumber: 13478,
      paymentDate: '04/09/2021',
      checkNumber: 1649824,
      observations: 'OBSERVATIONS TEST DATA',
    },
  ];

  paymentTestData = [
    {
      validKey: 'true',
      transferDate: '04/09/2019',
      id: 228378,
      date: '06/07/2018',
      reference: '15357800199706897572',
      amount: 5000,
      batch: 13,
      clientId: 53578,
      rfc: 'LUN1618KT91',
      name: 'IGNACIO MORALES',
      crossBankKey: 'AEF118BNT64',
      keyAuthorization: 'VORTEGA',
      keyChangeObservations: 'OBSERVATIONS TEST DATA',
      transferDateObservations: 'OBSERVATIONS TEST DATA',
    },
    {
      validKey: 'false',
      transferDate: '',
      id: 228379,
      date: '06/07/2018',
      reference: '10663200199706897579',
      amount: 5000,
      batch: 13,
      clientId: 6632,
      rfc: 'LUN1618KT341',
      name: 'JULIO PALACIOS',
      crossBankKey: 'AEF118B13PL0',
      keyAuthorization: 'VORTEGA',
      keyChangeObservations: 'OBSERVATIONS TEST DATA',
      transferDateObservations: 'OBSERVATIONS TEST DATA',
    },
    {
      validKey: 'true',
      transferDate: '04/09/2019',
      id: 228380,
      date: '06/07/2018',
      reference: '15566200199706897593',
      amount: 5000,
      batch: 13,
      clientId: 53579,
      rfc: 'LUN16GH210ED',
      name: 'GRACIELA MEJIA',
      crossBankKey: 'AEF1645RDNIO99',
      keyAuthorization: 'VORTEGA',
      keyChangeObservations: 'OBSERVATIONS TEST DATA',
      transferDateObservations: 'OBSERVATIONS TEST DATA',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private svPaymentDevolutionService: PaymentDevolutionService
  ) {
    super();
    this.controlSettings.columns = REFUND_CONTROL_COLUMNS;
    this.eventSettings.columns = RELATED_EVENT_COLUMNS;
    this.accountSettings.columns = BANK_ACCOUNTS_COLUMNS;
    this.paymentSettings.columns = PAYMENT_COLUMNS;
  }

  ngOnInit(): void {
    // this.accountSettings.columns = this.modifyColumns(
    //   this.accountSettings.columns
    // );
    // this.paymentSettings.columns = {
    //   ...this.paymentSettings.columns,
    //   validKey: {
    //     title: 'Clave Válida',
    //     type: 'custom',
    //     sort: false,
    //     renderComponent: CheckValidKeyComponent,
    //   },
    // };
    this.eventsTotalQuantity = 0;
    this.eventsTotalAmount = 0;
    this.prepareForm();
    this.getData();
    this.loadingDataTableControl();
    this.loadingDataTableRelationEvent();
    this.loadingDataTableBank();
  }

  private prepareForm(): void {
    this.controlForm = this.fb.group({
      filter: [null],
    });
  }

  getData() {
    this.eventColumns = [];
    this.eventTotalItems = 0;
    this.accountColumns = [];
    this.accountTotalItems = 0;
    this.paymentColumns = [];
    this.paymentTotalItems = 0;
    this.controlColumns = this.controlTestData;
    this.controlTotalItems = this.controlColumns.length;
  }

  modifyColumns(columns: any) {
    columns = {
      fis: {
        title: 'FIS',
        type: 'custom',
        sort: false,
        renderComponent: TableCheckboxComponent,
      },
      cnt: {
        title: 'CNT',
        type: 'custom',
        sort: false,
        renderComponent: TableCheckboxComponent,
      },
      pto: {
        title: 'PTO',
        type: 'custom',
        sort: false,
        renderComponent: TableCheckboxComponent,
      },
      tsr: {
        title: 'TSR',
        type: 'custom',
        sort: false,
        renderComponent: TableCheckboxComponent,
      },
      ...columns,
    };
    delete columns.status;
    return columns;
  }

  modifyStatus(columns: any[]) {
    columns = columns.map((c, i) => {
      let fis, cnt, pto, tsr: boolean;
      // c.status == 'CHECK' ? (type = true) : (type = false);
      switch (c.status) {
        case 'FIS':
          fis = true;
          cnt = false;
          pto = false;
          tsr = false;
          break;
        case 'CNT':
          fis = true;
          cnt = true;
          pto = false;
          tsr = false;
          break;
        case 'PTO':
          fis = true;
          cnt = true;
          pto = true;
          tsr = false;
          break;
        case 'TSR':
          fis = true;
          cnt = true;
          pto = true;
          tsr = true;
          break;
        default:
          break;
      }
      c = {
        ...c,
        fis: fis,
        cnt: cnt,
        pto: pto,
        tsr: tsr,
      };
      delete c.status;
      return c;
    });
    return columns;
  }

  getTotalQuantity(columns: any[]) {
    let total: number = 0;
    columns.forEach(c => {
      total = total + c.quantity;
    });
    return total;
  }

  getTotalAmount(columns: any[]) {
    let total: number = 0;
    columns.forEach(c => {
      total = total + c.amount;
    });
    return total;
  }

  selectControl(rows: any[]) {
    this.eventColumns = this.eventTestData;
    this.eventTotalItems = this.eventColumns.length;
    this.eventsTotalQuantity = this.getTotalQuantity(this.eventColumns);
    this.eventsTotalAmount = this.getTotalAmount(this.eventColumns);
    this.refundTabs.tabs[0].active = true;
    let { x, y } = this.tabsContainer.nativeElement.getBoundingClientRect();
    y = y - 300;
    window.scrollTo(x, y);
  }

  selectRelatedEvent(rows: any[]) {
    this.accountColumns = this.accountTestData;
    this.accountColumns = this.modifyStatus(this.accountColumns);
    this.accountTotalItems = this.accountColumns.length;
    this.accountsTotalQuantity = this.getTotalQuantity(this.accountColumns);
    this.accountsTotalAmount = this.getTotalAmount(this.accountColumns);
    this.paymentColumns = this.paymentTestData;
    this.paymentTotalItems = this.paymentColumns.length;
    this.paymentsTotalAmount = this.getTotalAmount(this.paymentColumns);
    this.refundTabs.tabs[1].active = true;
  }

  selectAccounts(rows: any[]) {
    this.selectedAccounts = rows;
  }

  selectPayment(rows: any[]) {
    this.selectedPayment = rows;
  }

  refreshAccountsPayments() {
    this.accountColumns = this.accountTestData;
    this.accountTotalItems = this.accountColumns.length;
    this.paymentColumns = this.paymentTestData;
    this.paymentTotalItems = this.paymentColumns.length;
  }

  filter(event: Event) {
    let { value } = event.target as HTMLInputElement;
    console.log(value, this.controlForm.get('filter').value);
    this.loadingDataTableControl();
  }

  refresh() {
    this.getData();
    this.layout = 'MAIN';
  }

  openControlModal() {
    const modalRef = this.modalService.show(CreateControlModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onControlAdded.subscribe((data: boolean) => {
      if (data) this.getData();
    });
  }

  openCreationModal() {
    const modalRef = this.modalService.show(CreationPermissionsModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  openKeyChangeModal() {
    const modalRef = this.modalService.show(KeyChangeModalComponent, {
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onKeyChange.subscribe((data: boolean) => {
      if (data) this.refreshAccountsPayments();
    });
  }

  openTransferDateModal() {
    const modalRef = this.modalService.show(TransferDateModalComponent, {
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onKeyChange.subscribe((data: boolean) => {
      if (data) this.refreshAccountsPayments();
    });
  }

  openRfcModal() {
    const modalRef = this.modalService.show(ChangeRfcModalComponent, {
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onChange.subscribe((data: boolean) => {
      if (data) this.refreshAccountsPayments();
    });
  }

  changeLayout(layout: string) {
    this.layout = layout;
  }

  sendRequests() {}

  formatTotalAmount(numberParam: number) {
    if (numberParam) {
      return new Intl.NumberFormat('es-MX').format(numberParam);
    } else {
      return '0.00';
    }
  }

  loadingDataTableControl() {
    //Filtrado por columnas
    this.dataTableControl
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              ctlDevPagId: () => (searchFilter = SearchFilter.EQ),
              cveCtlDevPag: () => (searchFilter = SearchFilter.ILIKE),
              idEstatus: () => (searchFilter = SearchFilter.EQ),
              direccion: () => (searchFilter = SearchFilter.EQ),
              idTipoDisp: () => (searchFilter = SearchFilter.EQ),
              idOrigen: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFiltersControl[
                field
              ] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFiltersControl[field];
            }
          });
          this.dataTableParamsControl = this.pageFilter(
            this.dataTableParamsControl
          );
          //Su respectivo metodo de busqueda de datos
          this.getControlData();
        }
      });
    console.log(this.controlForm.get('filter').value);
    if (this.controlForm.get('filter').value) {
      this.columnFiltersControl['filter.idEstatus'] = `${
        this.controlForm.get('filter').value == 'P'
          ? '$eq:PROC'
          : this.controlForm.get('filter').value == 'C'
          ? '$eq:CONC'
          : '$null'
      }`;
    }
    // this.columnFiltersControl['filter.creationdate'] = `$order:desc`;
    //observador para el paginado
    this.dataTableParamsControl
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getControlData());
  }

  getControlData() {
    this.loadingControl = true;
    let params = {
      ...this.dataTableParamsControl.getValue(),
      ...this.columnFiltersControl,
    };
    console.log('PARAMS ', params);
    this.svPaymentDevolutionService.getCtlDevPagH(params).subscribe({
      next: res => {
        console.log('DATA Control', res);
        this.testDataControl = res.data;
        this.dataTableControl.load(this.testDataControl);
        this.totalControl = res.count;
        this.totalControl_Count = res.totalLength;
        this.loadingControl = false;
      },
      error: error => {
        console.log(error);
        this.testDataControl = [];
        this.dataTableControl.load([]);
        this.totalControl = 0;
        this.totalControl_Count = 0;
        this.loadingControl = false;
      },
    });
  }

  loadingDataTableRelationEvent() {
    //Filtrado por columnas
    this.dataTableRelationEvent
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              eventId: () => (searchFilter = SearchFilter.EQ),
              numPayments: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFiltersRelationEvent[
                field
              ] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFiltersRelationEvent[field];
            }
          });
          this.dataTableParamsRelationEvent = this.pageFilter(
            this.dataTableParamsRelationEvent
          );
          //Su respectivo metodo de busqueda de datos
          this.getRelationEventData();
        }
      });
    // this.columnFiltersRelationEvent['filter.creationdate'] = `$order:desc`;
    //observador para el paginado
    this.dataTableParamsRelationEvent
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRelationEventData());
  }

  getRelationEventData() {
    this.loadingRelationEvent = true;
    let params = {
      ...this.dataTableParamsRelationEvent.getValue(),
      ...this.columnFiltersRelationEvent,
    };
    // let params_1 = new ListParams();
    // params_1 = { ...params };
    // console.log('PARAMS ', params, params_1);
    this.svPaymentDevolutionService.getEatCtlPagE(params).subscribe({
      next: (res: any) => {
        console.log('DATA RelationEvent', res);
        this.testDataRelationEvent = res.data;
        this.dataTableRelationEvent.load(this.testDataRelationEvent);
        this.totalRelationEvent = res.count;
        this.eventsTotalQuantity = res.numPaymentsTotal;
        this.eventsTotalAmount = res.paymentsAmountTotal;
        this.loadingRelationEvent = false;
      },
      error: error => {
        console.log(error);
        this.testDataRelationEvent = [];
        this.dataTableRelationEvent.load([]);
        this.totalRelationEvent = 0;
        this.eventsTotalQuantity = 0;
        this.eventsTotalAmount = 0;
        this.loadingRelationEvent = false;
      },
    });
  }

  loadingDataTableBank() {
    //Filtrado por columnas
    this.dataTableBank
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              eventId: () => (searchFilter = SearchFilter.EQ),
              numPayments: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFiltersBank[
                field
              ] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFiltersBank[field];
            }
          });
          this.dataTableParamsBank = this.pageFilter(this.dataTableParamsBank);
          //Su respectivo metodo de busqueda de datos
          this.getBankData();
        }
      });
    //observador para el paginado
    this.dataTableParamsBank
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getBankData());
  }

  getBankData() {
    this.loadingBank = true;
    let params = {
      ...this.dataTableParamsBank.getValue(),
      ...this.columnFiltersBank,
    };
    this.svPaymentDevolutionService.getEatCtlPagE(params).subscribe({
      next: (res: any) => {
        console.log('DATA Bank', res);
        this.testDataBank = res.data;
        this.dataTableBank.load(this.testDataBank);
        this.totalBank = res.count;
        this.eventsTotalQuantity = res.numPaymentsTotal;
        this.eventsTotalAmount = res.paymentsAmountTotal;
        this.loadingBank = false;
      },
      error: error => {
        console.log(error);
        this.testDataBank = [];
        this.dataTableBank.load([]);
        this.totalBank = 0;
        this.eventsTotalQuantity = 0;
        this.eventsTotalAmount = 0;
        this.loadingBank = false;
      },
    });
  }
}

import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { PaymentDevolutionService } from 'src/app/core/services/ms-paymentdevolution/payment-services.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';
import { ChangeRfcModalComponent } from './change-rfc-modal/change-rfc-modal.component';
import { CreateControlModalComponent } from './create-control-modal/create-control-modal.component';
import { KeyChangeModalComponent } from './key-change-modal/key-change-modal.component';
import {
  PAYMENT_COLUMNS,
  REFUND_CONTROL_COLUMNS,
  RELATED_EVENT_COLUMNS,
} from './payment-refund-columns';
import { TablePermissionsModalComponent } from './table-permissions-modal/table-permissions-modal.component';
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
  // Control Bank
  dataTableBankAccount: LocalDataSource = new LocalDataSource();
  dataTableParamsBankAccount = new BehaviorSubject<ListParams>(
    new ListParams()
  );
  loadingBankAccount: boolean = false;
  totalBankAccount: number = 0;
  testDataBankAccount: any[] = [];
  columnFiltersBankAccount: any = [];
  //
  controlForm: FormGroup = new FormGroup({});
  selectedAccounts: any[] = [];
  selectedAccountB: any = null;
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
  totalAmountAccount: number = 0;
  controlColumns: any[] = [];
  eventColumns: any[] = [];
  accountColumns: any[] = [];
  paymentColumns: any[] = [];
  controlSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    hideSubHeader: false,
    // selectMode: 'multi',
    // rowClassFunction: (row: any) => {
    //   if (row.data.seleccion == false) {
    //     return 'bg-success text-white';
    //   } else {
    //     return 'bg-dark text-white';
    //   }
    // },
  };
  selectedControl: any[] = [];
  eventSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    hideSubHeader: false,
    // selectMode: 'multi',
    // rowClassFunction: (row: any) => {
    //   if (row.data.seleccion == false) {
    //     return 'bg-success text-white';
    //   } else {
    //     return 'bg-dark text-white';
    //   }
    // },
  };
  selectedEvents: any[] = [];
  accountSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    // selectMode: 'multi',
    hideSubHeader: false,
  };
  paymentSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    hideSubHeader: false,
  };
  tokenData: any;
  devolutionCtlDevPagId: number = null;
  loadingreferenceRequest: boolean = false;
  countVerifPay: number = 0;
  selectBanksCheck: any[] = [];

  // BLK_BANCO_PAGOS
  blkBankPays: any[] = [];
  selectRowCtrol: any = null;
  disabledBtn: boolean = true;
  @ViewChild('myTabset', { static: true }) tabset: TabsetComponent;
  accountTotalItemsP: number = 0;
  loadingP: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private svPaymentDevolutionService: PaymentDevolutionService,
    private svPaymentService: PaymentService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private router: Router,
    private massiveGoodService: MassiveGoodService
  ) {
    super();
    this.controlSettings = {
      ...this.controlSettings,
      // rowClassFunction: (row: any) => {
      //   if (row.data.seleccion == 0) {
      //     return 'bg-success text-white';
      //   } else {
      //     return 'bg-dark text-white';
      //   }
      // },
    };
    this.controlSettings.columns = REFUND_CONTROL_COLUMNS;
    this.eventSettings = {
      ...this.eventSettings,
      // rowClassFunction: (row: any) => {
      //   if (row.data.seleccion == 0) {
      //     return 'bg-success text-white';
      //   } else {
      //     return 'bg-dark text-white';
      //   }
      // },
    };
    this.eventSettings.columns = RELATED_EVENT_COLUMNS;
    // RELATED_EVENT_COLUMNS.seleccion = {
    //   ...RELATED_EVENT_COLUMNS.seleccion,
    //   onComponentInitFunction: this.onClickSelectEvents.bind(this),
    // };

    this.accountSettings.columns = {
      // status: {
      //   title: 'Estatus',
      //   type: 'string',
      //   sort: false,
      // },
      cveBank: {
        title: 'Cve. Banco',
        type: 'string',
        sort: false,
      },
      account: {
        title: 'Cuenta',
        type: 'string',
        sort: false,
      },
      countPayments: {
        title: 'Cantidad',
        type: 'number',
        sort: false,
      },
      amountPayments: {
        title: 'Monto',
        type: 'number',
        sort: false,
        filter: false,
      },
      idwaste: {
        title: 'Id Gasto',
        type: 'number',
        sort: false,
      },
      idCtldevpag: {
        title: 'Id Pago',
        type: 'number',
        sort: false,
      },
      numberInvoicePay: {
        title: 'Folio Pag.',
        type: 'number',
        sort: false,
      },
      datePay: {
        title: 'Fecha Pago',
        type: 'string',
        sort: false,
        filter: false,
        valuePrepareFunction: (value: string) => {
          if (!value) {
            return '';
          }
          return new DatePipe('en-US').transform(value, 'dd-MM-yyyy');
        },
      },
      numberCheck: {
        title: 'No. de Cheque',
        type: 'number',
        sort: false,
      },
      obscanc: {
        title: 'Observaciones de Cancelación',
        sort: false,
        type: 'custom',
        renderComponent: SeeMoreComponent,
        valuePrepareFunction: (value: string) => {
          if (value == 'null' || value == 'undefined') {
            return '';
          }

          return value ? value : '';
        },
      },
      _fis: {
        title: 'FIS',
        sort: false,
        type: 'custom',
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction(instance: any) {
          instance.toggle.subscribe((data: any) => {
            console.log(data);
          });
        },
      },
      _cnt: {
        title: 'CNT',
        sort: false,
        type: 'custom',
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction(instance: any) {
          instance.toggle.subscribe((data: any) => {
            console.log(data);
          });
        },
      },
      _pto: {
        title: 'PTO',
        sort: false,
        type: 'custom',
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction(instance: any) {
          instance.toggle.subscribe((data: any) => {
            console.log(data);
          });
        },
      },
      _tsr: {
        title: 'TSR',
        sort: false,
        type: 'custom',
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction(instance: any) {
          instance.toggle.subscribe((data: any) => {
            console.log(data);
          });
        },
      },
      selection: {
        filter: false,
        sort: false,
        title: 'Selección',
        type: 'custom',
        showAlways: true,
        width: '15%',
        valuePrepareFunction: (isSelected: boolean, row: any) =>
          this.isBankSelected(row),
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onBankSelect(instance),
      },
    };
    this.paymentSettings.columns = PAYMENT_COLUMNS;
  }

  onBankSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.billingDetSelectedChange(data.row, data.toggle),
    });
  }
  isBankSelected(data: any) {
    const exists = this.selectBanksCheck.find(
      (item: any) => item.idEvent == data.idEvent
    );
    return !exists ? false : true;
  }
  billingDetSelectedChange(data: any, selected: boolean) {
    if (selected) {
      this.selectBanksCheck.push(data);
    } else {
      this.selectBanksCheck = this.selectBanksCheck.filter(
        (item: any) => item.detinvoiceId != data.detinvoiceId
      );
    }
  }

  onClickSelect(event: any) {
    if (event != undefined) {
      event.toggle.subscribe((data: any) => {
        data.row.selection = data.toggle;
        if (data.row.seleccion == false) {
          let row: any = data.row;
          const index = this.selectedControl.findIndex(
            _data => _data.ctlDevPagId == row.ctlDevPagId
          );
          if (index == -1 && data.toggle == true) {
            this.selectedControl.push(row);
          } else if (index != -1 && data.toggle == false) {
            this.selectedControl.splice(index, 1);
          }
          const index_1: number = this.selectedControl.findIndex(
            _data => _data.ctlDevPagId == data.row.ctlDevPagId
          );
          this.testDataControl[index_1].seleccion = 1;
          this.dataTableControl.load(this.testDataControl);
          this.dataTableControl.refresh();
        } else {
          const index: number = this.selectedControl.findIndex(
            _data => _data.ctlDevPagId == data.row.ctlDevPagId
          );
          this.testDataControl[index].seleccion = 0;
          this.dataTableControl.load(this.testDataControl);
          this.dataTableControl.refresh();
        }
        console.log('SELECIONADOS AL MOMENTO ###### ', this.selectedControl);
      });
    }
  }

  onClickSelectEvents(event: any) {
    if (event != undefined) {
      event.toggle.subscribe((data: any) => {
        data.row.selection = data.toggle;
        if (data.row.seleccion == false) {
          let row: any = data.row;
          const index = this.selectedEvents.findIndex(
            _data => _data.eventId == row.eventId
          );
          if (index == -1 && data.toggle == true) {
            this.selectedEvents.push(row);
          } else if (index != -1 && data.toggle == false) {
            this.selectedEvents.splice(index, 1);
          }
          const index_1: number = this.selectedEvents.findIndex(
            _data => _data.eventId == data.row.eventId
          );
          // this.testDataRelationEvent[index_1].seleccion = 1;
          this.dataTableRelationEvent.load(this.testDataRelationEvent);
          this.dataTableRelationEvent.refresh();
        } else {
          const index: number = this.selectedEvents.findIndex(
            _data => _data.eventId == data.row.eventId
          );
          this.testDataRelationEvent[index].seleccion = 0;
          this.dataTableRelationEvent.load(this.testDataRelationEvent);
          this.dataTableRelationEvent.refresh();
        }
        console.log('SELECIONADOS AL MOMENTO ###### ', this.selectedEvents);
      });
    }
  }
  ngOnInit(): void {
    this.tokenData = this.authService.decodeToken();
    this.getComerCtrlCreation('P');
    this.eventsTotalQuantity = 0;
    this.eventsTotalAmount = 0;
    this.prepareForm();
    this.getData();

    this.loadingDataTableBank();
    this.loadingDataTableBankAccount();
  }
  // COMER_CTLCREACION
  async getComerCtrlCreation(status: string) {
    if (!this.tokenData) {
      this.alert(
        'warning',
        'Datos usuario actual',
        'Error al obtener la información del usuario actual'
      );
      return;
    }
    let params1 = new ListParams();
    params1['filter.user'] = `$eq:${this.tokenData.preferred_username}`;
    params1['filter.indGuarantee'] = `$eq:1`;
    // ID_ORIGEN = 1;
    let res1 = await this.getCrtlCreate(params1);

    let params2 = new ListParams();
    params2['filter.user'] = `$eq:${this.tokenData.preferred_username}`;
    params2['filter.inddisp'] = `$eq:1`;
    // ID_ORIGEN = 2;
    let res2 = await this.getCrtlCreate(params2);

    if (res1 && res2) {
      this.dataTableParamsControl.getValue()['filter.idOrigen'] = `$in:1,2`;
    } else if (!res1 && res2) {
      this.dataTableParamsControl.getValue()['filter.idOrigen'] = `$eq:2`;
    } else if (res1 && !res2) {
      this.dataTableParamsControl.getValue()['filter.idOrigen'] = `$eq:1`;
    } else {
      return;
    }
    if (status == 'P') {
      this.dataTableParamsControl.getValue()['filter.idEstatus'] = `$eq:PROC`;
    } else if (status == 'C') {
      this.dataTableParamsControl.getValue()['filter.idEstatus'] = `$eq:CONC`;
    } else {
      delete this.dataTableParamsControl.getValue()['filter.idEstatus'];
    }

    this.loadingDataTableControl();
  }

  async getCrtlCreate(params: ListParams) {
    return new Promise((resolve, reject) => {
      this.svPaymentDevolutionService.getEatCtlCreate_(params).subscribe({
        next: (res: any) => {
          resolve(true);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  private prepareForm(): void {
    this.controlForm = this.fb.group({
      filter: ['P'],
    });
  }

  getData() {
    this.eventColumns = [];
    this.eventTotalItems = 0;
    this.accountColumns = [];
    this.accountTotalItems = 0;
    this.paymentColumns = [];
    this.paymentTotalItems = 0;
    this.controlTotalItems = this.controlColumns.length;
  }

  selectControl(event: any) {
    if (event) {
      this.selectRowCtrol = event.data;
      this.devolutionCtlDevPagId = event.data.ctlDevPagId;
      this.getRelationEventData();
      this.getBankData();
      if (event.data.idEstatus == 'PROC') {
        this.disabledBtn = true;
      } else {
        this.disabledBtn = false;
      }
    }
    if (event.isSelected) {
      // this.devolutionCtlDevPagId = event.data.ctlDevPagId;
      // this.loadingDataTableRelationEvent();
    } else {
      // this.devolutionCtlDevPagId = null;
      // this.testDataRelationEvent = [];
      // this.dataTableRelationEvent.load([]);
      // this.totalRelationEvent = 0;
      // this.eventsTotalQuantity = 0;
      // this.eventsTotalAmount = 0;
    }
    // console.log(
    //   'CONTROL SELECTED ',
    //   event,
    //   this.dataTableControl,
    //   this.devolutionCtlDevPagId
    // );
  }

  selectRelatedEvent(rows: any[]) {
    console.log('EVENTS SELECTED ', rows);
  }

  selectAccounts(event: any) {
    this.selectedAccountB = event;
    if (event) {
      this.getBankAccountData();
    }
  }

  selectPayment(rows: any[]) {
    this.selectedPayment = rows;
  }

  refreshAccountsPayments() {
    // this.accountColumns = this.accountTestData;
    this.accountTotalItems = this.accountColumns.length;
    // this.paymentColumns = this.paymentTestData;
    this.paymentTotalItems = this.paymentColumns.length;
  }

  // PUP_ACT_HEADER
  filter(event: Event) {
    let { value } = event.target as HTMLInputElement;
    console.log(value, this.controlForm.get('filter').value);
    this.getComerCtrlCreation(value);
  }

  refresh() {
    this.getData();
    this.layout = 'MAIN';
  }

  getComerCreationData() {
    if (!this.tokenData) {
      this.alert(
        'warning',
        'Datos usuario actual',
        'Error al obtener la información del usuario actual'
      );
      return;
    }
    this.svPaymentDevolutionService
      .getEatCtlCreate(this.tokenData.preferred_username)
      .subscribe({
        next: (res: any) => {
          // console.log('DATA Control Modal', res);
          this.openControlModal(res.indGuarantee, res.inddisp);
        },
        error: error => {
          // console.log(error);
          this.openControlModal(0, 0);
        },
      });
  }

  openControlModal(ind_garant: number, ind_disp: number) {
    if (ind_garant != 0 && ind_disp != 0) {
      const modalRef = this.modalService.show(CreateControlModalComponent, {
        initialState: {
          ind_garant,
          ind_disp,
        },
        class: 'modal-xl modal-dialog-centered',
        ignoreBackdropClick: true,
      });
      modalRef.content.onControlAdded.subscribe((data: boolean) => {
        if (data) this.getControlData();
      });
    } else {
      this.alert('warning', 'No cuenta con permisos de creación', '');
    }
  }

  openCreationModal() {
    const modalRef = this.modalService.show(TablePermissionsModalComponent, {
      class: 'modal-xl modal-dialog-centered',
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

  changeLayout() {
    this.router.navigate(
      ['/pages/commercialization/layouts-configuration']
      // {
      //   queryParams: {
      //   },
      // }
    );
  }

  async sendRequests() {
    const dataBanks = await this.dataTableBank.getAll();
    const dataEvents = await this.dataTableRelationEvent.getAll();
    // GO_BLOCK('COMER_CTLDEVPAG_B');
    if (dataBanks.length == 0) {
      this.alert(
        'warning',
        'No hay registros cargados en la tabla "Control de Devoluciones"',
        ''
      );
      return;
    }
    if (this.selectBanksCheck.length == 0) {
      return this.alert(
        'warning',
        'No se tienen registros de Bancos a procesar.',
        'Selecciona por lo menos un registro de la tabla "Control de Devoluciones"'
      );
    }

    this.alertQuestion(
      'question',
      'Envío de Solicitudes de Gasto a SIRSAE',
      '¿Desear Continua?'
    ).then(question => {
      if (question.isConfirmed) {
        let result = dataBanks.map(async item => {
          if (item.idwaste && item.idCtldevpag) {
            // PUP_ENVIAR_SIRSAE
            let body = {};
            await this.pupSendSirsae(body);
            if (item.idOrigen == 2) {
            }
          }
        });

        Promise.all(result).then(res => {
          this.alert('success', 'Proceso terminado', '');
        });
      }
    });
  }
  // PUP_ENVIAR_SIRSAE
  async pupSendSirsae(data: any) {
    return new Promise((resolve, reject) => {
      // ENDPOINT EDWIN //
    });
  }
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
              fecCreacion: () => (searchFilter = SearchFilter.EQ),
              fecTermino: () => (searchFilter = SearchFilter.EQ),
              idTipoDisp: () => (searchFilter = SearchFilter.EQ),
              idOrigen: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              if (
                filter.field == 'fecCreacion' ||
                filter.field == 'fecTermino'
              ) {
                filter.search = this.datePipe.transform(
                  filter.search,
                  'yyyy-MM-dd'
                );
              }
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
    // console.log(this.controlForm.get('filter').value);
    if (this.controlForm.get('filter').value) {
      // this.columnFiltersControl['filter.idEstatus'] = `${
      //   this.controlForm.get('filter').value == 'P'
      //     ? '$eq:PROC'
      //     : this.controlForm.get('filter').value == 'C'
      //     ? '$eq:CONC'
      //     : '$ilike:'
      // }`;
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
    params['sortBy'] = `ctlDevPagId:DESC`;
    // params['filter.idEstatus'] = `$eq:PROC`
    // console.log('PARAMS ', params);
    this.svPaymentDevolutionService.getCtlDevPagH(params).subscribe({
      next: res => {
        // console.log('DATA Control', res);
        this.testDataControl = res.data.map((i: any) => {
          const index2: number = this.selectedControl.findIndex(
            (_data: any) => _data.ctlDevPagId == i.ctlDevPagId
          );
          if (index2 > -1) {
            i['seleccion'] = 1;
            return i;
          } else {
            i['seleccion'] = 0;
            return i;
          }
        });
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

    //observador para el paginado
    this.dataTableParamsRelationEvent
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => {
        if (this.totalRelationEvent > 0) this.getRelationEventData();
      });
  }

  getRelationEventData() {
    this.loadingRelationEvent = true;
    let params = {
      ...this.dataTableParamsRelationEvent.getValue(),
      ...this.columnFiltersRelationEvent,
    };
    // if (this.devolutionCtlDevPagId) {
    params['filter.ctlDevPagId'] = `$eq:${this.selectRowCtrol.ctlDevPagId}`;
    // }
    // let params_1 = new ListParams();
    // params_1 = { ...params };
    // console.log('PARAMS ', params, params_1);
    this.svPaymentDevolutionService.getEatCtlPagE(params).subscribe({
      next: (res: any) => {
        console.log('DATA RelationEvent', res);
        let result = res.data.map((i: any) => {
          const index2: number = this.selectedEvents.findIndex(
            (_data: any) => _data.ctlDevPagId == i.ctlDevPagId
          );
          if (index2 > -1) {
            i['seleccion'] = 1;
            return i;
          } else {
            i['seleccion'] = 0;
            return i;
          }
        });
        Promise.all(result).then(resp => {
          this.dataTableRelationEvent.load(res.data);
          this.dataTableRelationEvent.refresh();
          this.totalRelationEvent = res.count;
          this.eventsTotalQuantity = res.numPaymentsTotal;
          this.eventsTotalAmount = res.paymentsAmountTotal;
          this.loadingRelationEvent = false;
        });
      },
      error: error => {
        console.log(error);
        this.testDataRelationEvent = [];
        this.dataTableRelationEvent.load([]);
        this.dataTableRelationEvent.refresh();
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
              cveBank: () => (searchFilter = SearchFilter.ILIKE),
              account: () => (searchFilter = SearchFilter.EQ),
              countPayments: () => (searchFilter = SearchFilter.EQ),
              idwaste: () => (searchFilter = SearchFilter.EQ),
              idCtldevpag: () => (searchFilter = SearchFilter.EQ),
              numberInvoicePay: () => (searchFilter = SearchFilter.EQ),
              numberCheck: () => (searchFilter = SearchFilter.EQ),
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
      .subscribe(() => {
        if (this.accountTotalItems > 0) this.getBankData();
      });
  }

  getBankData() {
    this.loadingBank = true;
    let params = {
      ...this.dataTableParamsBank.getValue(),
      ...this.columnFiltersBank,
    };
    params['filter.idCtldevpag'] = `$eq:${this.selectRowCtrol.ctlDevPagId}`;
    // idCtldevpag
    this.svPaymentService.getCtlDevPagBfindAllRegistersV2(params).subscribe({
      next: (res: any) => {
        console.log('DATA Bank', res);
        let result = res.data.map((i: any) => {
          i['_fis'] = i.indfis;
          i['_cnt'] = i.indcnt;
          i['_pto'] = i.indpt;
          i['_tsr'] = i.indtsr;
          // return i;
        });
        Promise.all(result).then(resp => {
          this.dataTableBank.load(res.data);
          this.dataTableBank.refresh();
          this.accountTotalItems = res.count;
          this.accountsTotalQuantity = res.totalCountPayments;
          this.accountsTotalAmount = res.totalAmountPayments;
          this.loadingBank = false;
        });
      },
      error: error => {
        console.log(error);
        this.testDataBank = [];
        this.dataTableBank.load([]);
        this.dataTableBank.refresh();
        this.accountTotalItems = 0;
        this.accountsTotalQuantity = 0;
        this.accountsTotalAmount = 0;
        this.loadingBank = false;
      },
    });
  }

  loadingDataTableBankAccount() {
    //Filtrado por columnas
    this.dataTableBankAccount
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
              this.columnFiltersBankAccount[
                field
              ] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFiltersBankAccount[field];
            }
          });
          this.dataTableParamsBankAccount = this.pageFilter(
            this.dataTableParamsBankAccount
          );
          //Su respectivo metodo de busqueda de datos
          this.getBankAccountData();
        }
      });
    //observador para el paginado
    this.dataTableParamsBankAccount
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => {
        if (this.accountTotalItemsP > 0) this.getBankAccountData();
      });
  }

  getBankAccountData() {
    this.loadingBankAccount = true;
    let params = {
      ...this.dataTableParamsBankAccount.getValue(),
      ...this.columnFiltersBankAccount,
    };
    params[
      'filter.devPaymentControlId'
    ] = `$eq:${this.selectedAccountB.idCtldevpag}`;
    params['filter.account'] = `$eq:${this.selectedAccountB.account}`;
    params['filter.bankCode'] = `$eq:${this.selectedAccountB.cveBank}`;
    // CONSULTAR LA VISTA VW_COMER_CTLDEVPAG_P
    this.svPaymentDevolutionService.getCtlDevPagP(params).subscribe({
      next: (res: any) => {
        console.log('DATA BankAccount', res);
        this.testDataBankAccount = res.data;
        this.dataTableBankAccount.load(this.testDataBankAccount);
        this.accountTotalItemsP = res.count;
        this.totalAmountAccount = res.paymentsAmountTotal;
        this.loadingBankAccount = false;
      },
      error: error => {
        console.log(error);
        this.testDataBankAccount = [];
        this.dataTableBankAccount.load([]);
        this.accountTotalItemsP = 0;
        this.totalAmountAccount = 0;
        this.loadingBankAccount = false;
      },
    });
  }

  async requestSpentGenerator() {
    const dataBanks = await this.dataTableBank.getAll();
    const dataEvents = await this.dataTableRelationEvent.getAll();
    let n_MONTO_PAGOS: number;
    let n_CANT_PAGOS: number;
    // GO_BLOCK('COMER_CTLDEVPAG_B');
    if (dataBanks.length == 0) {
      this.alert(
        'warning',
        'No hay registros cargados en la tabla "Control de Devoluciones"',
        ''
      );
      return;
    }
    if (this.selectBanksCheck.length == 0) {
      return this.alert(
        'warning',
        'No se tienen registros de Bancos a procesar.',
        'Selecciona por lo menos un registro de la tabla "Control de Devoluciones"'
      );
    }
    // GO_BLOCK('COMER_CTLDEVPAG_E');
    if (dataEvents.length == 0) {
      this.alert('warning', 'No se tienen Eventos relacionados.', '');
    }
    let arrEvents = [];
    let c_REL_EVENTOS = '';
    for (const event of dataEvents) {
      arrEvents.push(event.event);
    }

    let c_DESC_RECIBO = await this.getDescRecibo();
    this.blkBankPays = [];

    let result = this.selectBanksCheck.map(async item => {
      // COMER_CTLDEVPAG_H.ID_ORIGEN = 1
      if (this.selectRowCtrol.idOrigen == 1) {
        let resBank: any = await this.catBanks();
        let objCreate = {
          CLKPV: resBank.CLKPV,
          NOMBREPROV: resBank.NOMBREPROV,
          CVE_BANCO: item.cveBank,
          CUENTA: item.account,
          MONTO: item.amountPayments,
          COMENTARIO: `${item.cveBank} DEVOLUCIÓN DE DEPÓSITO POR CONCEPTO DE GARANTIA DE SERIEDAD CORRESPONDIENTE A LA
          ${c_DESC_RECIBO} ${this.selectRowCtrol.cveCtlDevPag} (${c_REL_EVENTOS}) DE ${item.countPayments} PAGOS`,
          DOCUMENTACION_ANEXA: `RELACIÓN DE DEVOLUCIONES DE GARANTIAS DE SERIEDAD DE LA ${this.selectRowCtrol.cveCtlDevPag}
          (${c_REL_EVENTOS}), DEPOSITADAS EN LA CUENTA DE ${resBank.NOMBREPROV} |${item.cveBank}|`,
        };
      } else {
        n_MONTO_PAGOS = n_MONTO_PAGOS + Number(item.amountPayments);
        n_CANT_PAGOS = n_CANT_PAGOS + Number(item.countPayments);
      }
    });
    Promise.all(result).then(res => {
      if (this.selectRowCtrol.idOrigen == 1) {
        // :COMER_GASTOS.ID_EVENTO := 9999999;
        // :COMER_GASTOS.DIRECCION := 'M';
        // :COMER_GASTOS.ID_CONCEPTO := 544;
        // :COMER_GASTOS.DESC_CONCEPTO := 'PAGO POR CONCEPTO DE GARANTÍAS';
      } else {
        // :COMER_GASTOS.ID_EVENTO := n_EVENTO;
        // SELECT DIRECCION
        //   INTO :COMER_GASTOS.DIRECCION
        //   FROM COMER_EVENTOS
        // WHERE ID_EVENTO = n_EVENTO;
        // :COMER_GASTOS.ID_CONCEPTO := 21;
        // :COMER_GASTOS.DESC_CONCEPTO := 'PAGO POR CONCEPTO DE PAGO EN EXCESO';
        // /* << JACG 15-05-19 Se actualiza la dirección del Evento para CLientes ganadores. */
        // IF n_MONTO_PAGOS > 0 THEN
        //   :BLK_BANCO_PAGOS.CLKPV := 19819;
        //   :BLK_BANCO_PAGOS.NOMBREPROV := 'BANAMEX PORTAL SAE';
        //   :BLK_BANCO_PAGOS.CVE_BANCO := 'BANAMEX PS';
        //   :BLK_BANCO_PAGOS.CUENTA := '7007-1894728';
        //   :BLK_BANCO_PAGOS.MONTO := n_MONTO_PAGOS;
        //   :BLK_BANCO_PAGOS.COMENTARIO := SUBSTR('|'||'SAE'||
        //                                   '| DEVOLUCIÓN DE PAGOS EN EXCESO CORRESPONDIENTE A LA '||
        //                                   c_DESC_RECIBO||' '||:COMER_CTLDEVPAG_H.CVE_CTLDEVPAG||' ('||c_REL_EVENTOS||') DE '||
        //                                   n_CANT_PAGOS||' PAGOS',1,255);
        //   :BLK_BANCO_PAGOS.DOCUMENTACION_ANEXA := SUBSTR('RELACIÓN DE PAGOS EN EXCESO DE LA '||
        //                                           :COMER_CTLDEVPAG_H.CVE_CTLDEVPAG||' ('||c_REL_EVENTOS||')',1,255);
        // END IF;
      }
    });
  }
  async getDescRecibo() {
    // SELECT DESC_RECIBO
    //   INTO c_DESC_RECIBO
    //   FROM COMER_TPEVENTOS
    //   WHERE ID_TPEVENTO = (SELECT ID_TPEVENTO
    //                         FROM COMER_EVENTOS
    //                         WHERE ID_EVENTO = :COMER_CTLDEVPAG_E.ID_EVENTO);
  }
  async catBanks() {
    // SELECT ID_PROVEEDOR,
    //       NOMBRE
    // INTO :BLK_BANCO_PAGOS.CLKPV,
    //       :BLK_BANCO_PAGOS.NOMBREPROV
    // FROM CAT_BANCOS
    // WHERE CVE_BANCO = :COMER_CTLDEVPAG_B.CVE_BANCO;
  }
  referenceRequestExpensesPayments() {
    if (!this.selectRowCtrol) {
      this.alertInfo(
        'warning',
        'Debe seleccionar un registro de la tabla Control de Devoluciones',
        ''
      ).then(question => {
        if (question.isConfirmed) {
          this.cambiarTab(0);
        }
      });
      return;
    }
    // PUP_EXP_CSV_REFSOL
    this.alertQuestion(
      'question',
      'Se generará el archivo',
      '¿Desea Continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        this.loadingreferenceRequest = true;
        this.svPaymentService
          .getExpRefSol(this.selectRowCtrol.ctlDevPagId)
          .subscribe({
            next: (data: any) => {
              this.loadingreferenceRequest = false;
              // console.log(data);

              this.alert('success', 'Archivo generado correctamente', ``);
              this.downloadFile(
                data.base64,
                `Referencias_Solicitudes_Gastos_Pagos_${new Date().getTime()}`
              );
            },
            error: error => {
              this.loadingreferenceRequest = false;
              this.alert('error', 'Error al generar el archivo', '');
            },
          });
      }
    });
  }
  downloadFile(base64: any, fileName: any) {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.target = '_blank';
    downloadLink.click();
    downloadLink.remove();
  }
  async verifyPaysSirsae() {
    const dataBanks = await this.dataTableBank.getAll();
    const dataEvents = await this.dataTableRelationEvent.getAll();
    // GO_BLOCK('COMER_CTLDEVPAG_B');
    if (dataBanks.length == 0) {
      this.alert(
        'warning',
        'No hay registros cargados en la tabla "Control de Devoluciones"',
        ''
      );
      return;
    }
    if (this.selectBanksCheck.length == 0) {
      return this.alert(
        'warning',
        'No se tienen registros de Bancos a procesar.',
        'Selecciona por lo menos un registro de la tabla "Control de Devoluciones"'
      );
    }

    this.alertQuestion(
      'question',
      'Verificación de pagos en SIRSAE',
      '¿Desear Continua?'
    ).then(async question => {
      if (question.isConfirmed) {
        // PUP_VERIF_PAGO_SIRSAE
        let respuesta: boolean = true;
        let result = dataBanks.map(async item => {
          let body = {};
          let res: boolean = await this.verifySirsae(body);
          if (!res) {
            respuesta = res;
            return;
          }
        });
        Promise.all(result).then(async res => {
          if (!respuesta)
            return this.alert(
              'warning',
              'Ocurrió un error al intentar verificar pagos en SIRSAE',
              ''
            );

          await this.continueVerifySirsae();
        });
        // this.startVariableVerifyPays(); // Antiguo llamado de serivicio
      }
    });
  }

  async continueVerifySirsae() {
    let n_ID_CTLDEVPAG: any;
    // -- VERIFICA TODOS LOS PAGOS PARA CAMBIO DE ESTATUS DE CONTROL --
    let counts: any = await this.getCounts();
    if (counts.n_CONTT == counts.n_CONTF && counts.n_CONTT > 0) {
      n_ID_CTLDEVPAG = this.selectRowCtrol.ctlDevPagId;
      let res = await this.updateCtrlDevPagH();
      this.filterActHeader('I');
    } else {
      this.dataTableBank.load([]);
      this.dataTableBank.refresh();
      this.accountTotalItems = 0;
    }
    this.alert('success', 'Proceso terminado', '');
  }

  // UPDATE - COMER_CTLDEVPAG_H //
  updateCtrlDevPagH() {
    return new Promise((resolve, reject) => {
      // UPDATE COMER_CTLDEVPAG_H
      //       SET ID_ESTATUS = 'CONC',
      //           FEC_TERMINO = SYSDATE
      //     WHERE ID_CTLDEVPAG = n_ID_CTLDEVPAG;
      resolve(true);
    });
  }

  getCounts() {
    // EDWIN
    return new Promise((resolve, reject) => {
      resolve({});
    });
    //     SELECT COUNT(0),
    //           NVL(SUM(DECODE(DECODE(OBS_CANC,NULL,0,1)+DECODE(NVL(IND_TSR,0),1,1,0),0,0,1)),0)
    // --             COUNT(NO_FOLIO_PAGO)
    //     INTO n_CONTT,
    //           n_CONTF
    //     FROM COMER_CTLDEVPAG_B
    //     WHERE ID_CTLDEVPAG = :COMER_CTLDEVPAG_H.ID_CTLDEVPAG;
  }
  verifySirsae(body: any): Promise<boolean> {
    // PUP_VERIF_PAGO_SIRSAE
    // EDWIN
    return new Promise<boolean>((resolve, reject) => {
      resolve(true);
    });
  }
  startVariableVerifyPays() {
    this.countVerifPay = 1;
    this.loadingreferenceRequest = true;
    this.sendVerifyPays();
  }
  sendVerifyPays() {
    this.svPaymentService
      .getExpRefSol(this.selectedAccounts[0].idCtldevpag)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (this.selectAccounts.length == this.countVerifPay) {
            this.loadingreferenceRequest = false;
            this.endSendVerifyPays();
          }
        },
        error: error => {
          if (this.selectAccounts.length == this.countVerifPay) {
            this.loadingreferenceRequest = false;
            this.endSendVerifyPays();
          }
        },
      });
  }
  endSendVerifyPays() {}

  // PUP_ACT_HEADER
  filterActHeader(event: string) {
    this.controlForm.get('filter').setValue(event);
    this.getComerCtrlCreation(event);
  }

  generateFile1() {
    if (!this.selectRowCtrol) {
      this.alertInfo(
        'warning',
        'Debe seleccionar un registro de la tabla Control de Devoluciones',
        ''
      ).then(question => {
        if (question.isConfirmed) {
          this.cambiarTab(0);
        }
      });
      return;
    }
    let body = {
      originId: this.selectRowCtrol.idOrigen,
      ctldevpagId: this.selectRowCtrol.ctlDevPagId,
      crldevpagKey: this.selectRowCtrol.cveCtlDevPag,
    };
    this.alertQuestion(
      'question',
      'Se generará el archivo',
      '¿Desea Continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        // PUP_EXP_CSV_RELDEVGAR
        this.massiveGoodService.applicationPupExpCsvReldevgar(body).subscribe({
          next: (data: any) => {
            // this.loadingreferenceRequest = false;
            // console.log(data);

            this.alert('success', 'Archivo generado correctamente', ``);
            this.downloadFile(
              data.base64,
              `RELACIÓN_DE_DEVOLUCIONES_DE_GARANTIA_DE_SERIEDAD`
            );
          },
          error: error => {
            // this.loadingreferenceRequest = false;
            this.alert('error', 'Error al generar el archivo', '');
          },
        });
      }
    });
  }
  generateFile2() {
    this.alertQuestion(
      'question',
      'Se generarán los Layouts',
      '¿Desea Continuar?'
    ).then(question => {
      if (question.isConfirmed) {
      }
    });
  }

  async cambiarTab(numberTab: any) {
    console.log(numberTab);
    this.refundTabs.tabs[numberTab].active = true;
  }
}

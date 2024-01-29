import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
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
import { CheckboxElementComponent_ } from 'src/app/pages/final-destination-process/donation-process/maintenance-commitment-donation/data-in-table/CheckboxDisabled';
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
import { TransferDateTableComponent } from './transfer-date-table/transfer-date-table.component';
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
        width: '10%',
      },
      account: {
        title: 'Cuenta',
        type: 'string',
        sort: false,
        width: '10%',
      },
      countPayments: {
        title: 'Cantidad',
        type: 'number',
        sort: false,
        width: '10%',
      },
      amountPayments: {
        title: 'Monto',
        type: 'html',
        sort: false,
        // filter: false,
        width: '10%',
        valuePrepareFunction: (amount: string) => {
          const numericAmount = parseFloat(amount);

          if (!isNaN(numericAmount)) {
            const a = numericAmount.toLocaleString('en-US', {
              // style: 'currency',
              // currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            return '<p class="cell_right">' + a + '</p>';
          } else {
            return amount;
          }
        },
        filterFunction(cell?: any, search?: string): boolean {
          return true;
        },
      },
      idwaste: {
        title: 'Id Gasto',
        type: 'number',
        sort: false,
        width: '10%',
      },
      idCtldevpag: {
        title: 'Id Pago',
        type: 'number',
        sort: false,
        width: '10%',
      },
      numberInvoicePay: {
        title: 'Folio Pag.',
        type: 'number',
        sort: false,
        width: '10%',
      },
      datePay: {
        title: 'Fecha Pago',
        type: 'string',
        sort: false,
        // filter: false,
        width: '20%',
        valuePrepareFunction: (text: string) => {
          return `${
            text ? text.split('T')[0].split('-').reverse().join('/') : ''
          }`;
        },
        filter: {
          type: 'custom',
          component: CustomDateFilterComponent,
        },
        filterFunction(): boolean {
          return true;
        },
        // valuePrepareFunction: (value: string) => {
        //   if (!value) {
        //     return '';
        //   }
        //   return new DatePipe('en-US').transform(value, 'dd-MM-yyyy');
        // },
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
        width: '30%',
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
        width: '10%',
        filter: {
          type: 'list',
          config: {
            selectText: 'Todos',
            list: [
              { value: '1', title: 'Activo' },
              { value: '0', title: 'Inactivo' },
            ],
          },
        },
        renderComponent: CheckboxElementComponent_,
        onComponentInitFunction(instance: any) {
          instance.toggle.subscribe((data: any) => {
            console.log(data);
          });
        },
        filterFunction: () => {
          return true;
        },
      },
      _cnt: {
        title: 'CNT',
        sort: false,
        type: 'custom',
        width: '10%',
        filter: {
          type: 'list',
          config: {
            selectText: 'Todos',
            list: [
              { value: '1', title: 'Activo' },
              { value: '0', title: 'Inactivo' },
            ],
          },
        },
        renderComponent: CheckboxElementComponent_,
        onComponentInitFunction(instance: any) {
          instance.toggle.subscribe((data: any) => {
            console.log(data);
          });
        },
        filterFunction: () => {
          return true;
        },
      },
      _pto: {
        title: 'PTO',
        sort: false,
        type: 'custom',
        width: '10%',
        filter: {
          type: 'list',
          config: {
            selectText: 'Todos',
            list: [
              { value: '1', title: 'Activo' },
              { value: '0', title: 'Inactivo' },
            ],
          },
        },
        renderComponent: CheckboxElementComponent_,
        onComponentInitFunction(instance: any) {
          instance.toggle.subscribe((data: any) => {
            console.log(data);
          });
        },
        filterFunction: () => {
          return true;
        },
      },
      _tsr: {
        title: 'TSR',
        sort: false,
        type: 'custom',
        width: '10%',
        filter: {
          type: 'list',
          config: {
            selectText: 'Todos',
            list: [
              { value: '1', title: 'Activo' },
              { value: '0', title: 'Inactivo' },
            ],
          },
        },
        renderComponent: CheckboxElementComponent_,
        onComponentInitFunction(instance: any) {
          instance.toggle.subscribe((data: any) => {
            console.log(data);
          });
        },
        filterFunction: () => {
          return true;
        },
      },
      selection: {
        filter: false,
        sort: false,
        title: 'Selección',
        type: 'custom',
        showAlways: true,
        width: '10%',
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
    this.loadingDataTableRelationEvent();
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
    if (!this.selectRowCtrol) {
      this.alertInfo(
        'warning',
        'Debe seleccionar un registro de la tabla: "Control de Devoluciones"',
        ''
      ).then(question => {
        if (question.isConfirmed) {
          this.cambiarTab(0);
        }
      });
      return;
    }

    if (!this.selectedAccountB) {
      this.alertInfo(
        'warning',
        'Cuentas de Banco Relacionadas',
        'Debe seleccionar al menos un registro de la tabla'
      ).then(question => {
        if (question.isConfirmed) {
          this.cambiarTab(2);
        }
      });
      return;
    }

    const modalRef = this.modalService.show(TransferDateTableComponent, {
      initialState: {
        selectedAccountB: this.selectedAccountB,
        selectRowCtrol: this.selectRowCtrol,
      },
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    // modalRef.content.onKeyChange.subscribe((data: boolean) => {
    //   if (data) this.refreshAccountsPayments();
    // });
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
      this.alertInfo(
        'warning',
        'Cuentas de Banco Relacionadas',
        'No se tienen registros de Bancos a enviar a SIRSAE'
      ).then(question => {
        if (question.isConfirmed) {
          this.cambiarTab(2);
        }
      });
      return;
    }
    if (this.selectBanksCheck.length == 0) {
      this.alertInfo(
        'warning',
        'Cuentas de Banco Relacionadas',
        'Debe seleccionar al menos un registro de la tabla'
      ).then(question => {
        if (question.isConfirmed) {
          this.cambiarTab(2);
        }
      });
      return;
    }

    this.alertQuestion(
      'question',
      'Envío de Solicitudes de Gasto a SIRSAE',
      '¿Desear Continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        let result = dataBanks.map(async item => {
          if (item.idwaste && item.idCtldevpag) {
            // PUP_ENVIAR_SIRSAE
            let body = {
              pSpentId: item.idwaste,
              pBankKey: item.cveBank,
              pAccount: item.account,
              toolbarUser: this.authService.decodeToken().preferred_username,
              idCtldevpag: item.idCtldevpag,
              originId: item.idOrigen,
            };
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
              paymentsAmount: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              if (filter.field == 'amountPayments') {
                this.columnFiltersRelationEvent[
                  field
                ] = `${searchFilter}:${filter.search.replace(/,/g, '')}`;
              } else {
                this.columnFiltersRelationEvent[
                  field
                ] = `${searchFilter}:${filter.search}`;
              }
              // this.columnFiltersRelationEvent[
              //   field
              // ] = `${searchFilter}:${filter.search}`;
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
        // this.getRelationEventData();
        if (this.totalRelationEvent > 0) this.getRelationEventData();
      });
  }

  getRelationEventData() {
    if (!this.selectRowCtrol) return;
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
            // if('_fis'){
            //   field = `filter.fis`;
            // }else if('_cnt'){
            //   field = `filter.cnt`;
            // }if('_pto'){
            //   field = `filter.pto`;
            // }if('_tsr'){
            //   field = `filter.tsr`;
            // }else{
            field = `filter.${filter.field}`;
            // }

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              cveBank: () => (searchFilter = SearchFilter.ILIKE),
              account: () => (searchFilter = SearchFilter.EQ),
              countPayments: () => (searchFilter = SearchFilter.EQ),
              idwaste: () => (searchFilter = SearchFilter.EQ),
              idCtldevpag: () => (searchFilter = SearchFilter.EQ),
              numberInvoicePay: () => (searchFilter = SearchFilter.EQ),
              numberCheck: () => (searchFilter = SearchFilter.EQ),
              amountPayments: () => (searchFilter = SearchFilter.EQ),
              _fis: () => (searchFilter = SearchFilter.EQ),
              _cnt: () => (searchFilter = SearchFilter.EQ),
              _pto: () => (searchFilter = SearchFilter.EQ),
              _tsr: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              if (filter.field == 'amountPayments') {
                this.columnFiltersBank[
                  field
                ] = `${searchFilter}:${filter.search.replace(/,/g, '')}`;
              } else {
                this.columnFiltersBank[
                  field
                ] = `${searchFilter}:${filter.search}`;
              }
              // this.columnFiltersBank[
              //   field
              // ] = `${searchFilter}:${filter.search}`;
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
    if (!this.selectRowCtrol) return;
    this.loadingBank = true;
    let params = {
      ...this.dataTableParamsBank.getValue(),
      ...this.columnFiltersBank,
    };
    params['filter.idCtldevpag'] = `$eq:${this.selectRowCtrol.ctlDevPagId}`;
    params['sortBy'] = `account,cveBank:ASC`;

    if (params['filter._fis']) {
      params['filter.indfis'] = params['filter._fis'] + '';
      delete params['filter._fis'];
    } else if (params['filter._cnt']) {
      params['filter.indcnt'] = params['filter._cnt'] + '';
      delete params['filter._cnt'];
    }
    if (params['filter._pto']) {
      params['filter.indpt'] = params['filter._pto'] + '';
      delete params['filter._pto'];
    }
    if (params['filter._tsr']) {
      params['filter.indtsr'] = params['filter._tsr'] + '';
      delete params['filter._tsr'];
    }
    // idCtldevpag
    this.svPaymentService.getCtlDevPagBfindAllRegistersV2(params).subscribe({
      next: (res: any) => {
        console.log('DATA Bank', res);
        let result = res.data.map((i: any) => {
          // IF :COMER_CTLDEVPAG_B.OBS_CANC IS NOT NULL THEN
          //   c_VISUAL := 'VA_REG_PROC_CANC';
          // ELSIF NVL(:COMER_CTLDEVPAG_B.IND_TSR,0) = 1 THEN
          //   c_VISUAL := 'VA_REG_PROC_PAGO';
          // ELSIF :COMER_CTLDEVPAG_B.ID_SOLICITUDPAGO IS NOT NULL THEN
          //   c_VISUAL := 'VA_REG_PROC_SP';
          // END IF;
          i['_fis'] = i.indfis == 1 ? true : false;
          i['_cnt'] = i.indcnt == 1 ? true : false;
          i['_pto'] = i.indpt == 1 ? true : false;
          i['_tsr'] = i.indtsr == 1 ? true : false;
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
              paymentsAmount: () => (searchFilter = SearchFilter.EQ),
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
    // this.loadingBankAccount = true;
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
    return;
    this.svPaymentDevolutionService
      .getApplicationVwComerCtldevPagp(params)
      .subscribe({
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
        'Debe seleccionar un registro de la tabla: "Control de Devoluciones"',
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
    if (!this.selectRowCtrol) {
      this.alertInfo(
        'warning',
        'Debe seleccionar un registro de la tabla: "Control de Devoluciones"',
        ''
      ).then(question => {
        if (question.isConfirmed) {
          this.cambiarTab(0);
        }
      });
      return;
    }

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
      this.alertInfo(
        'warning',
        'Cuentas de Banco Relacionadas',
        'Debe seleccionar al menos un registro de la tabla'
      ).then(question => {
        if (question.isConfirmed) {
          this.cambiarTab(2);
        }
      });
      return;
      // return this.alert(
      //   'warning',
      //   'No se tienen registros de Bancos a procesar.',
      //   'Selecciona por lo menos un registro de la tabla "Control de Devoluciones"'
      // );
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
    let counts: any = await this.getCounts(this.selectRowCtrol.ctlDevPagId);

    if (counts.countt == counts.countf && counts.countt > 0) {
      n_ID_CTLDEVPAG = this.selectRowCtrol.ctlDevPagId;
      let data = {
        ctlDevPagId: n_ID_CTLDEVPAG,
        idEstatus: 'CONC',
        fecTermino: new Date(),
      };
      let res = await this.updateCtrlDevPagH(data, n_ID_CTLDEVPAG);
      console.log('res', res);
      this.filterActHeader('I');
    } else {
      this.dataTableBank.load([]);
      this.dataTableBank.refresh();
      this.accountTotalItems = 0;
      this.getControlData();
    }
    this.alert('success', 'Proceso terminado', '');
  }

  // UPDATE - COMER_CTLDEVPAG_H //
  updateCtrlDevPagH(data: any, id: any) {
    return new Promise((resolve, reject) => {
      this.svPaymentDevolutionService.updateCtlDevPagH(data, id).subscribe({
        next(value) {
          resolve(value);
        },
        error(err) {
          resolve(null);
        },
      });
      // UPDATE COMER_CTLDEVPAG_H
      //       SET ID_ESTATUS = 'CONC',
      //           FEC_TERMINO = SYSDATE
      //     WHERE ID_CTLDEVPAG = n_ID_CTLDEVPAG;
      resolve(true);
    });
  }

  getCounts(id: number | string) {
    // EDWIN
    return new Promise((resolve, reject) => {
      this.svPaymentDevolutionService
        .getApplicationGetComerCtldevpagb(id)
        .subscribe({
          next(value) {
            resolve(value.data[0]);
          },
          error(err) {
            let obj = {
              countt: 0,
              countf: 0,
            };
            resolve(obj);
          },
        });
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
        'Debe seleccionar un registro de la tabla: "Control de Devoluciones"',
        ''
      ).then(question => {
        if (question.isConfirmed) {
          this.cambiarTab(0);
        }
      });
      return;
    }
    // let body = {
    //   id_ctldevpag: this.selectRowCtrol.ctlDevPagId,
    //   id_origen: this.selectRowCtrol.idOrigen,
    //   cve_ctldevpag: this.selectRowCtrol.cveCtlDevPag
    // }
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
        // this.svPaymentDevolutionService.applicationPupExpCsvReldevGar(body).subscribe({
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

import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IComerGastosDev } from 'src/app/core/models/ms-spent/comer-expense';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { BankService } from 'src/app/core/services/catalogs/bank.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { PaymentDevolutionService } from 'src/app/core/services/ms-paymentdevolution/payment-services.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent_ } from 'src/app/pages/final-destination-process/donation-process/maintenance-commitment-donation/data-in-table/CheckboxDisabled';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';
import { ChangeRfcModalComponent } from './change-rfc-modal/change-rfc-modal.component';
import { CheckboxElementComponent2 } from './checkbox-element';
import { CommunicationService } from './communication-service/communication-service';
import { CreateControlModalComponent } from './create-control-modal/create-control-modal.component';
import { ExpensesRequestComponent } from './expenses-request/expenses-request.component';
import { FilterCheckboxComponent } from './filterCheckbox-elements';
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
  styles: [
    `
      button.loading:after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-right-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-left: 5px;
        vertical-align: middle;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
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
  public toggleAll$: Observable<any | undefined> | undefined;
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
  controlForm2: FormGroup = new FormGroup({});
  selectedAccounts: any[] = [];
  selectedAccountB: any = null;
  selectedPayment: any = null;
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
    ...this.settings,
  };
  paymentSettings = {
    ...this.settings,
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
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  comerGastos: IComerGastosDev;

  btnLoading: boolean = false;
  btnLoading2: boolean = false;
  btnLoading3: boolean = false;
  btnLoading4: boolean = false;
  btnLoading5: boolean = false;
  valBtns: boolean = false;
  private _unsubscribeAll: Subject<void>;
  toggleAll: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private svPaymentDevolutionService: PaymentDevolutionService,
    private svPaymentService: PaymentService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private router: Router,
    private massiveGoodService: MassiveGoodService,
    private comerTpEventosService: ComerTpEventosService,
    private comerEventosService: ComerEventosService,
    private bankService: BankService,
    private parameterModService: ParameterModService,
    private communicationService: CommunicationService
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

    this.accountSettings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: {
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
        },
        idwaste: {
          title: 'Id Gasto',
          type: 'number',
          sort: false,
          width: '10%',
        },
        payIdmentrequest: {
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
          showAlways: true,
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
          showAlways: true,
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
          showAlways: true,
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
          showAlways: true,
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
          filter: {
            type: 'custom',
            component: FilterCheckboxComponent,
          },
          sort: false,
          title: 'Selección',
          type: 'custom',
          showAlways: true,
          width: '10%',

          valuePrepareFunction: (isSelected: boolean, row: any) =>
            this.isBankSelected(row),
          renderComponent: CheckboxElementComponent2,
          onComponentInitFunction: (instance: CheckboxElementComponent2) =>
            this.onBankSelect(instance),
        },
      },
      rowClassFunction: (row: any) => {
        // console.log("row", row.data)
        if (row.data.idwaste != null) {
          if (row.data.obscanc != null) {
            // 'VA_REG_PROC_CANC';
            return 'bg-no-approved';
          } else if (row.data.indtsr == 1) {
            // VA_REG_PROC_PAGO
            return '';
          } else if (row.data.payIdmentrequest != null) {
            // VA_REG_PROC_SP
            return 'bg-warning text-black';
          }
          return '';
        }
        return '';
      },
    };
    this.paymentSettings.columns = PAYMENT_COLUMNS;
    this.paymentSettings = {
      ...this.paymentSettings,
      actions: false,
      hideSubHeader: false,
      columns: {
        payId: {
          title: 'Id Pago',
          type: 'string',
          sort: false,
        },
        payDate: {
          title: 'Fecha',
          type: 'string',
          sort: false,
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
        },
        reference: {
          title: 'Referencia',
          type: 'number',
          sort: false,
        },
        amount: {
          title: 'Monto',
          type: 'html',
          sort: false,
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
        },
        lotPublic: {
          title: 'Lote',
          type: 'string',
          sort: false,
        },
        customerId: {
          title: 'Id Cliente',
          type: 'number',
          sort: false,
        },
        rfc: {
          title: 'R.F.C',
          type: 'string',
          sort: false,
        },
        customer: {
          title: 'Nombre / Denominación',
          type: 'string',
          sort: false,
        },
        interbankCode: {
          title: 'Clabe Interbancaria',
          type: 'string',
          sort: false,
        },
        keyAuthorization: {
          title: 'Autoriza Cambio Clabe',
          type: 'string',
          sort: false,
          filter: false,
        },
        keyChangeObservations: {
          title: 'Observaciones de Cambio Clabe',
          type: 'string',
          sort: false,
          filter: false,
        },
        obsTransDate: {
          title: 'Observaciones de Fecha de Transferencia',
          type: 'string',
          sort: false,
        },
        _statusClabe: {
          title: 'Clabe Válida',
          type: 'custom',
          sort: false,
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
        dateTransfer: {
          title: 'Fecha Transf.',
          type: 'string',
          sort: false,
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
        },
      },
      rowClassFunction: (row: any) => {
        if (row.data.statusClabe == 0) {
          return 'bg-no-approved';
        }
        if (row.data.keyAuthorization != null) {
          return 'bg-warning text-black';
        }
        return '';
      },
    };
  }

  async selectAll(toggle: boolean) {
    let data = await this.dataTableBank.getAll();
    if (toggle) {
      for (const item of data) {
        if (item.idwaste) this.selectBanksCheck.push(item);
      }
      this.dataTableBank.refresh();
    } else {
      this.selectBanksCheck = [];
      this.dataTableBank.refresh();
    }
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
    // PUP_LLENA_DEFAULTS
    this.pupLlenaDefaults();
    this.getValid();
    this.getComerCtrlCreation('P');
    this.eventsTotalQuantity = 0;
    this.eventsTotalAmount = 0;
    this.prepareForm();
    this.getData();

    this.loadingDataTableBank();
    this.loadingDataTableBankAccount();
    this.loadingDataTableRelationEvent();
    this.communicationService.changeValSelect$.subscribe(async (next: any) => {
      this.selectAll(next);
    });
  }
  async getValid() {
    let res = await this.getValBtnLayoutsPermissions();
    if (res) this.valBtns = true;
    else this.valBtns = false;
  }
  async getValBtnLayoutsPermissions() {
    const params = new ListParams();
    params.page = 1;
    params.limit = 1;
    params['filter.parametro'] = 'SUPUSUCOMER';
    params['filter.valor'] = this.tokenData.preferred_username;
    return new Promise((resolve, reject) => {
      this.parameterModService.getParamterMod_(params).subscribe({
        next: response => {
          console.log(response);
          resolve(response);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  // PUP_LLENA_DEFAULTS
  async pupLlenaDefaults() {
    this.comerGastos = {
      idConcept: null,
      descConcept: '',
      iva: 0,
      no_factura_rec: '1',
      fecha_factura_rec: new Date(),
      id_evento: 9999999,
      id_lote: null,
      usuario_capturo: '30884',
      usuario_autoriza: '30471',
      usuario_solicita: '9601',
      fecha_captura: new Date(),
      fecha_pago: null, // No se puede asignar PK_COMER_LC.OBTENER_POST_FECHA_HABIL (TRUNC(SYSDATE), 3, c_RESUL) en TypeScript
      num_comprobantes: 1,
      iva_retenido: 0,
      isr_retenido: 0,
      forma_pago: 'TRANSFERENCIA',
      comproafmandsae: 1,
      nom_sae: 'SAE',
      id_ordinginter: null,
      tipo_cambio: null,
      nom_empl_solicita: 'ALEJANDRO LEDESMA RIOS',
      nom_empl_autoriza: 'ALMARA EDILIA DABDOUB GIRON',
      nom_empl_captura: 'FERNANDO GOMEZ GUZMAN',
      ur_coordregional: null,
      direccion: 'M',
      usu_captura_siab: this.tokenData.preferred_username,
      tipo_pe: null,
      adj: null,
      indicador: 1,
    };
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
    this.controlForm2 = this.fb.group({
      txtMsg: [null],
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
      this.selectBanksCheck = [];
      this.getRelationEventData();
      this.getBankData();
      if (event.data.idEstatus == 'PROC') {
        this.disabledBtn = true;
      } else {
        this.disabledBtn = false;
      }
    }
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

  selectPayment(rows: any) {
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
    this.btnLoading = true;
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
      this.btnLoading = false;
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
      this.btnLoading = false;
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
      initialState: {
        selectedPayment: this.selectedPayment,
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onKeyChange.subscribe((data: boolean) => {
      if (data) this.getBankAccountData();
    });
  }

  openTransferDateModal() {
    if (!this.selectRowCtrol) {
      this.alertInfo(
        'warning',
        'Control de Devoluciones',
        'Debe seleccionar al menos un registro de la tabla'
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
    if (!this.selectRowCtrol) {
      this.alertInfo(
        'warning',
        'Control de Devoluciones',
        'Debe seleccionar al menos un registro de la tabla'
      ).then(question => {
        if (question.isConfirmed) {
          this.cambiarTab(0);
        }
      });
      return;
    }
    // GO_BLOCK('COMER_CTLDEVPAG_B');
    if (dataBanks.length == 0) {
      this.alertInfo(
        'warning',
        'Cuentas de Banco Relacionadas',
        'No se tienen registros de Bancos a procesar.'
      ).then(question => {
        if (question.isConfirmed) {
          this.cambiarTab(2);
        }
      });
      return;
    }
    let val = false;
    for (const item of dataBanks) {
      if (item.idwaste && !item.payIdmentrequest) {
        val = true;
        break;
      }
    }
    if (val == false) {
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
    this.btnLoading3 = true;
    this.alertQuestion(
      'question',
      'Envío de Solicitudes de Gastos a SIRSAE',
      '¿Desear Continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        let result = dataBanks.map(async item => {
          if (item.idwaste && !item.payIdmentrequest) {
            // PUP_ENVIAR_SIRSAE
            let body = {
              pSpentId: Number(item.idwaste),
              pBankKey: item.cveBank,
              pAccount: item.account,
              toolbarUser: this.authService.decodeToken().preferred_username,
              idCtldevpag: Number(item.idCtldevpag),
              originId: Number(this.selectRowCtrol.idOrigen),
            };
            await this.pupSendSirsae(body);
            if (this.selectRowCtrol.idOrigen == 2) {
              return;
            }
          }
        });

        Promise.all(result).then(res => {
          this.btnLoading3 = false;
          this.alert('success', 'Proceso terminado correctamente', '');
        });
      } else {
        this.btnLoading3 = false;
      }
    });
  }
  // PUP_ENVIAR_SIRSAE
  async pupSendSirsae(data: any) {
    return new Promise((resolve, reject) => {
      this.svPaymentDevolutionService.applicationPupSendSirsae(data).subscribe({
        next(value) {
          resolve(value);
        },
        error(err) {
          resolve(null);
        },
      });
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
        let result = res.data.map((i: any) => {
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
        Promise.all(result).then(resp => {
          if (res.data[0]) {
            this.selectRowCtrol = res.data[0];
            this.devolutionCtlDevPagId = res.data[0].ctlDevPagId;
            this.getRelationEventData();
            this.getBankData();
          }
          this.dataTableControl.load(res.data);
          this.dataTableControl.refresh();
          this.totalControl = res.count;
          this.totalControl_Count = res.totalLength;
          this.loadingControl = false;
        });
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
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              cveBank: () => (searchFilter = SearchFilter.ILIKE),
              account: () => (searchFilter = SearchFilter.EQ),
              countPayments: () => (searchFilter = SearchFilter.EQ),
              idwaste: () => (searchFilter = SearchFilter.EQ),
              payIdmentrequest: () => (searchFilter = SearchFilter.EQ),
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
    }
    if (params['filter._cnt']) {
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
          i['_fis'] = i.indfis == 1 ? true : false;
          i['_cnt'] = i.indcnt == 1 ? true : false;
          i['_pto'] = i.indpt == 1 ? true : false;
          i['_tsr'] = i.indtsr == 1 ? true : false;
        });
        Promise.all(result).then(resp => {
          this.selectedAccountB = res.data[0];
          if (res.data[0]) {
            this.getBankAccountData();
          }
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
              payId: () => (searchFilter = SearchFilter.EQ),
              payDate: () => (searchFilter = SearchFilter.EQ),
              reference: () => (searchFilter = SearchFilter.ILIKE),
              amount: () => (searchFilter = SearchFilter.EQ),
              lotPublic: () => (searchFilter = SearchFilter.EQ),
              customerId: () => (searchFilter = SearchFilter.EQ),
              rfc: () => (searchFilter = SearchFilter.ILIKE),
              customer: () => (searchFilter = SearchFilter.ILIKE),
              interbankCode: () => (searchFilter = SearchFilter.ILIKE),
              keyAuthorization: () => (searchFilter = SearchFilter.ILIKE),
              keyChangeObservations: () => (searchFilter = SearchFilter.ILIKE),
              obsTransDate: () => (searchFilter = SearchFilter.ILIKE),
              _statusClabe: () => (searchFilter = SearchFilter.EQ),
              dateTransfer: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              if (filter.field == 'amount') {
                this.columnFiltersBank[
                  field
                ] = `${searchFilter}:${filter.search.replace(/,/g, '')}`;
              } else {
                if (
                  filter.field == 'payDate' ||
                  filter.field == 'dateTransfer'
                ) {
                  filter.search = this.datePipe.transform(
                    filter.search,
                    'yyyy-MM-dd'
                  );
                }
                this.columnFiltersBank[
                  field
                ] = `${searchFilter}:${filter.search}`;
              }
              // this.columnFiltersBankAccount[
              //   field
              // ] = `${searchFilter}:${filter.search}`;
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
    params['filter.controlId'] = `$eq:${this.selectedAccountB.idCtldevpag}`;
    params['filter.account'] = `$eq:${this.selectedAccountB.account}`;
    params['filter.bankKey'] = `$eq:${this.selectedAccountB.cveBank}`;
    // CONSULTAR LA VISTA VW_COMER_CTLDEVPAG_P

    if (params['filter._statusClabe']) {
      params['filter.statusClabe'] = params['filter._statusClabe'] + '';
      delete params['filter._statusClabe'];
    }
    this.svPaymentDevolutionService
      .getApplicationVwComerCtldevPagp(params)
      .subscribe({
        next: (res: any) => {
          let val = false;
          let result = res.data.map((i: any) => {
            i['_statusClabe'] = i.statusClabe == 1 ? true : false;
            if (i.statusClabe == 0) val = true;
          });
          Promise.all(result).then(resp => {
            if (val)
              this.controlForm2
                .get('txtMsg')
                .setValue('Con CLABE(s) errónea(s)');
            else
              this.controlForm2
                .get('txtMsg')
                .setValue('Sin CLABE(s) errónea(s)');
            this.testDataBankAccount = res.data;
            this.dataTableBankAccount.load(this.testDataBankAccount);
            this.accountTotalItemsP = res.count;
            this.totalAmountAccount = res.paymentsAmountTotal;
            this.loadingBankAccount = false;
          });
          console.log('DATA BankAccount', res);
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
    let n_MONTO_PAGOS: number = 0;
    let n_CANT_PAGOS: number = 0;

    if (!this.selectRowCtrol) {
      this.alertInfo(
        'warning',
        'Control de Devoluciones',
        'Debe seleccionar al menos un registro de la tabla'
      ).then(question => {
        if (question.isConfirmed) {
          this.cambiarTab(0);
        }
      });
      return;
    }
    // GO_BLOCK('COMER_CTLDEVPAG_E');
    if (dataEvents.length == 0) {
      this.alertInfo(
        'warning',
        'Eventos Relacionados',
        'No se tienen Eventos relacionados.'
      ).then(question => {
        if (question.isConfirmed) {
          this.cambiarTab(1);
        }
      });
      return;
    }

    // GO_BLOCK('COMER_CTLDEVPAG_B');
    if (dataBanks.length == 0) {
      this.alert(
        'warning',
        'Cuentas de Banco Relacionadas',
        'No se tienen registros de Bancos a procesar.'
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
    }
    this.btnLoading2 = true;
    let arrEvents = [];
    let c_REL_EVENTOS = '';
    let n_event: number;
    for (const event of dataEvents) {
      arrEvents.push(event.eventId);
      n_event = Number(event.eventId);
    }
    c_REL_EVENTOS = arrEvents.join(', ');

    let c_DESC_RECIBO = await this.getDescRecibo(dataEvents[0].eventId);
    this.blkBankPays = [];
    console.log(c_DESC_RECIBO);
    let result = this.selectBanksCheck.map(async item => {
      // COMER_CTLDEVPAG_H.ID_ORIGEN = 1
      if (this.selectRowCtrol.idOrigen == 1) {
        let resBank: any = await this.catBanks(item.cveBank);
        let name = resBank ? resBank.name : '';
        let idProvider = resBank ? resBank.idProvider : '';
        let objCreate = {
          beneficiary: idProvider,
          name: name,
          cveBank: item.cveBank,
          account: item.account,
          amount: item.amountPayments,
          commentary: `${item.cveBank} DEVOLUCIÓN DE DEPÓSITO POR CONCEPTO DE GARANTIA DE SERIEDAD CORRESPONDIENTE A LA
          ${c_DESC_RECIBO} ${this.selectRowCtrol.cveCtlDevPag} (${c_REL_EVENTOS}) DE ${item.countPayments} PAGOS`,
          documentation: `RELACIÓN DE DEVOLUCIONES DE GARANTIAS DE SERIEDAD DE LA ${this.selectRowCtrol.cveCtlDevPag}
          (${c_REL_EVENTOS}), DEPOSITADAS EN LA CUENTA DE ${name} ${item.cveBank}`,
        };
        this.blkBankPays.push(objCreate);
      } else {
        n_MONTO_PAGOS = n_MONTO_PAGOS + Number(item.amountPayments);
        n_CANT_PAGOS = n_CANT_PAGOS + Number(item.countPayments);
      }
    });
    Promise.all(result).then(async res => {
      console.log(this.blkBankPays);
      if (this.selectRowCtrol.idOrigen == 1) {
        this.comerGastos.id_evento = 9999999;
        this.comerGastos.direccion = 'M';
        this.comerGastos.idConcept = 544;
        this.comerGastos.descConcept = 'PAGO POR CONCEPTO DE GARANTÍAS';
        this.openModal(this.comerGastos);
      } else {
        this.comerGastos.id_evento = n_event;
        this.comerGastos.idConcept = 21;
        this.comerGastos.descConcept = 'PAGO POR CONCEPTO DE PAGO EN EXCESO';
        let dataEvent: any = await this.comerEvents(n_event);
        console.log(dataEvent);
        if (dataEvent) this.comerGastos.direccion = dataEvent.address;

        if (n_MONTO_PAGOS > 0) {
          let objCreate = {
            beneficiary: 19819,
            name: 'BANAMEX PORTAL SAE',
            cveBank: 'BANAMEX PS',
            account: '7007-1894728',
            amount: n_MONTO_PAGOS,
            commentary: `SAE DEVOLUCIÓN DE DEPÓSITO POR CONCEPTO DE GARANTIA DE SERIEDAD CORRESPONDIENTE A LA
            ${c_DESC_RECIBO} ${this.selectRowCtrol.cveCtlDevPag} (${c_REL_EVENTOS}) DE ${n_CANT_PAGOS} PAGOS`,
            documentation: `RELACIÓN DE PAGOS EN EXCESO DE LA ${this.selectRowCtrol.cveCtlDevPag}
            (${c_REL_EVENTOS})`,
          };
          this.blkBankPays.push(objCreate);
        }
        this.openModal(this.comerGastos);
      }
    });
  }

  openModal(comerGastosFields?: any) {
    this.btnLoading2 = false;
    let config: ModalOptions = {
      initialState: {
        selectRowCtrol: this.selectRowCtrol,
        comerGastosFields,
        blkBankPays: this.blkBankPays,
        callback: (next: boolean) => {
          if (next) {
            this.selectBanksCheck = [];
            this.getBankData();
          }
        },
      },
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ExpensesRequestComponent, config);
  }
  async getDescRecibo(eventId: any) {
    let evento: any = await this.comerEvents(eventId);
    if (evento) {
      let tpEvento: any = await this.comerTpEvents(evento.eventTpId);
      if (tpEvento) {
        return tpEvento.descReceipt;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  async comerEvents(id: string | number) {
    return new Promise((resolve, reject) => {
      this.comerEventosService.getComerEventById(id).subscribe({
        next(value) {
          resolve(value);
        },
        error(err) {
          resolve(null);
        },
      });
    });
  }

  async comerTpEvents(id: string | number) {
    return new Promise((resolve, reject) => {
      this.comerTpEventosService.getByIdComerTEvents(id).subscribe({
        next(value) {
          resolve(value);
        },
        error(err) {
          resolve(null);
        },
      });
    });
  }
  async catBanks(cveBank: string) {
    const params = new ListParams();
    params['filter.bankCode'] = `$eq:${cveBank}`;
    return new Promise((resolve, reject) => {
      console.log(cveBank);
      this.bankService.getAll_(params).subscribe({
        next(value) {
          resolve(value.data[0]);
        },
        error(err) {
          resolve(null);
        },
      });
    });
  }
  referenceRequestExpensesPayments() {
    if (!this.selectRowCtrol) {
      this.alertInfo(
        'warning',
        'Control de Devoluciones',
        'Debe seleccionar al menos un registro de la tabla'
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
    if (!this.selectRowCtrol) {
      this.alertInfo(
        'warning',
        'Control de Devoluciones',
        'Debe seleccionar al menos un registro de la tabla'
      ).then(question => {
        if (question.isConfirmed) {
          this.cambiarTab(0);
        }
      });
      return;
    }

    // GO_BLOCK('COMER_CTLDEVPAG_B');
    if (dataBanks.length == 0) {
      this.alertInfo(
        'warning',
        'Cuentas de Banco Relacionadas',
        'No se tienen registros de Bancos a procesar.'
      ).then(question => {
        if (question.isConfirmed) {
          this.cambiarTab(2);
        }
      });
      return;
    }
    this.btnLoading4 = true;
    let arr = [];
    if (dataBanks) {
      for (const item of dataBanks) {
        if (item.payIdmentrequest) {
          arr.push(item);
        }
      }
      if (arr.length == 0) {
        this.btnLoading4 = false;
        this.alertInfo(
          'warning',
          'Cuentas de Banco Relacionadas',
          'No se tienen registros de Bancos a verificar Pagos'
        ).then(question => {
          if (question.isConfirmed) {
            this.cambiarTab(2);
          }
        });
        return;
      }
    }

    this.alertQuestion(
      'question',
      'Verificación de pagos en SIRSAE',
      '¿Desear Continuar?'
    ).then(async question => {
      if (question.isConfirmed) {
        // PUP_VERIF_PAGO_SIRSAE
        let respuesta: boolean = true;
        console.log('dataBanks', dataBanks);
        let result = dataBanks.map(async item => {
          if (item.payIdmentrequest) {
            let body = {
              pApplicationId: item.payIdmentrequest,
              pBankKey: item.cveBank,
              pAccount: item.account,
              originId: this.selectRowCtrol.idOrigen,
              ctldevpagId: this.selectRowCtrol.ctlDevPagId,
            };
            let res: boolean = await this.verifySirsae(body);
            if (!res) {
              respuesta = res;
              return;
            }
          }
        });
        Promise.all(result).then(async res => {
          if (!respuesta) {
            this.btnLoading4 = false;
            this.alert(
              'warning',
              'Ocurrió un error al intentar verificar pagos en SIRSAE',
              ''
            );
            return;
          }

          await this.continueVerifySirsae();
        });
        // this.startVariableVerifyPays(); // Antiguo llamado de serivicio
      } else {
        this.btnLoading4 = false;
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
      this.btnLoading4 = false;
    } else {
      this.dataTableBank.load([]);
      this.dataTableBank.refresh();
      this.accountTotalItems = 0;
      this.getControlData();
      this.btnLoading4 = false;
    }
    this.alert('success', 'Proceso Terminado Correctamente', '');
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
    });
  }

  getCounts(id: number | string) {
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
  }
  verifySirsae(body: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.svPaymentDevolutionService
        .applicationPupVerifPagoSirsae(body)
        .subscribe({
          next(value) {
            resolve(true);
          },
          error(err) {
            resolve(false);
          },
        });
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
        'Control de Devoluciones',
        'Debe seleccionar al menos un registro de la tabla'
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
        let data = {};
        this.pupGeneLayout(data);
      }
    });
  }
  pupGeneLayout(data: any) {
    return new Promise((resolve, reject) => {
      this.massiveGoodService.applicationPupGenLayouts(data).subscribe({
        next(value) {
          resolve(value);
        },
        error(err) {
          resolve(false);
        },
      });
    });
  }
  async cambiarTab(numberTab: any) {
    console.log(numberTab);
    this.refundTabs.tabs[numberTab].active = true;

    setTimeout(() => {
      this.performScroll();
    }, 200);
  }

  performScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  method2(data: any) {
    setTimeout(() => {
      this.goExpenseCapture();
    }, 100);
    // this.alert("success", "AQUI", data)
  }

  goExpenseCapture() {
    console.log(this.selectedAccountB);
    if (!this.selectedAccountB) return;
    if (!this.selectedAccountB.idwaste)
      return this.alert('warning', 'No se tienen Folio de Gasto.', '');

    this.router.navigate(['/pages/commercialization/expense-capture/M'], {
      queryParams: {
        origin: 'FCOMERCTLDPAG',
        P_ID_GASTO: this.selectedAccountB.idwaste,
      },
    });
  }
  method3(data: any) {
    setTimeout(() => {
      if (!this.selectedPayment)
        return this.alert('warning', 'Debe seleccinar un pago', '');
      if (this.selectedPayment.statusClabe == 0) this.openKeyChangeModal();
    }, 100);
  }
}

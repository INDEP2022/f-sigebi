import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGraceDate } from 'src/app/core/models/ms-event/event.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { ISendSirsaeLot } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae-model';
import { InterfacesirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import {
  IPupProcSeldisp,
  IPupValidateMandatoNfac,
} from 'src/app/core/services/ms-lot/models-lots';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { SpentService } from 'src/app/core/services/ms-spent/comer-expenses.service';
import { BasePage } from 'src/app/core/shared';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { CanLcsWarrantyComponent } from '../can-lcs-warranty/can-lcs-warranty.component';
import { CanPagosCabComponent } from '../can-pagos-cab/can-pago-cab.component';
import { CanRelusuComponent } from '../can-relusu/can-relusu.component';
import { CanUsuSirsaeComponent } from '../can-usu-sirsae/can-usu-sirsae.component';
import { ComerPaymentVirtComponent } from '../comer-payment-virt/comer-payment-virt.component';
import { clearGoodCheckCustomer } from '../dispersion-payment-details/customers/columns';
import {
  COLUMNSCUSTOMER,
  COLUMNS_CUSTOMER_BANKS,
  COLUMNS_DESERT_LOTS,
  COLUMNS_LOTS_BANKS,
  COLUMNS_LOT_EVENT_FALSE,
  COLUMNS_LOT_EVENT_TRUE,
  COLUMNS_PAYMENT_LOT,
  setCheckHide,
} from './columns';

@Component({
  selector: 'app-dispersion-payment',
  templateUrl: './dispersion-payment.component.html',
  styleUrls: ['dispersion-payment.css'],
})
export class DispersionPaymentComponent extends BasePage implements OnInit {
  //Preparar los setting de las tablas
  settingsCustomer = this.settings;
  settingsLotEvent = this.settings;
  settingsDesertedLots = this.settings;
  settingsCustomerBanks = this.settings;
  settingsLotsBanks = this.settings;
  settingsPaymentLots = this.settings;

  loadingCustomer = false;
  loadingLotEvent = false;
  loadingDesertLots = false;
  loadingCustomerBanks = false;
  loadingLotBanks = false;
  loadingPaymentLots = false;

  loadingValidAmount = false;
  loadingTotal = false;

  loadingExcel = false;

  form: FormGroup;
  formCustomerEvent: FormGroup;
  formLotEvent: FormGroup;
  formDesertLots: FormGroup;
  formCustomerBanks: FormGroup;
  formLotsBanks: FormGroup;
  formPaymentLots: FormGroup;
  formSirsae: FormGroup;
  formRbButton: FormGroup;

  statusEvent: string = null;
  eventType: string = null;
  eventManagement: string = null;

  dataCustomer = new LocalDataSource();
  dataLotEvent = new LocalDataSource();
  dataDesertedLots = new LocalDataSource();
  dataCustomerBanks = new LocalDataSource();
  dataLotsBanks = new LocalDataSource();
  dataPaymentLots = new LocalDataSource();

  paramsCustomer = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsCustomer: number = 0;
  limitCustomer = new FormControl(10);

  paramsLotEvent = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsLotEvent: number = 0;
  limitLotEvent = new FormControl(10);

  paramsDesertedLots = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsDesertedLots: number = 0;
  limitDesertedLots = new FormControl(10);

  paramsCustomerBanks = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsCustomerBanks: number = 0;
  limitCustomerBanks = new FormControl(10);

  paramsLotsBanks = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsLotsBanks: number = 0;
  limitLotsBanks = new FormControl(10);

  paramsPaymentLots = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsPaymentLots: number = 0;
  limitPaymentLots = new FormControl(10);

  statusVtaId: any = null;
  idClientCustomer: any = null;

  isAvailableByType: boolean = true;

  idBatch: any = null;
  idClientBatch: any = null;
  referenceBatch: any = null;
  amountBatch: any = null;
  idPaymentBatch: any = null;
  idOrderBatch: any = null;

  dataBatch: any = null;

  private clie_procesar: boolean = false;
  private lot_procesar: boolean = false;
  private clie_solo_pend: boolean = false;
  private lot_solo_pend: boolean = false;

  private txt_usu_valido: string = null;
  private id_tipo_disp: number = null;

  //Arrays
  batchEventSelect: any[]

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private paymentService: PaymentService,
    private securityService: SecurityService,
    private parametersModService: ParameterModService,
    private comerEventService: ComerEventService,
    private comerTpEventsService: ComerTpEventosService,
    private comerLotsService: LotService,
    private spentService: SpentService,
    private comerEventosService: ComerEventosService,
    private modalService: BsModalService,
    private customersService: ComerClientsService,
    private interfaceSirsaeService: InterfacesirsaeService,
    private router: Router,
    private depositaryService: MsDepositaryService
  ) {
    super();
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    //Formas
    this.prepareForm();
    this.initialize();
    //Navegador
    this.navigateCustomerXClient();
    //Settings
    this.prepareSettings();
    //Verificar si hay idEvento
    const idLocal = localStorage.getItem('eventId_dispersion');
    if (idLocal != null) {
      this.event.setValue(idLocal);
      this.selectEvent();
      localStorage.removeItem('eventId_dispersion');
    }
  }

  //Navegar en la tabla de clientes
  navigateCustomerXClient() {
    this.paramsCustomer.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      console.log(params);
      this.limitCustomer = new FormControl(params.limit);
      if (this.dataCustomer['data'].length > 0) {
        this.loadingCustomer = true;
        this.getDataComerCustomer();
      }
    });
  }

  //Preparar Settings
  prepareSettings() {
    this.settingsCustomer = {
      ...TABLE_SETTINGS,
      rowClassFunction: (row: { data: { available: any } }) =>
        row.data.available ? 'bg-success text-white' : 'bg-dark text-white',
      actions: false,
      columns: COLUMNSCUSTOMER,
    };

    this.settingsLotEvent = {
      ...TABLE_SETTINGS,
      rowClassFunction: (row: { data: { available: any } }) =>
        row.data.available ? 'bg-success text-white' : 'bg-dark text-white',
      actions: false,
      columns: COLUMNS_LOT_EVENT_TRUE,
    };

    this.settingsDesertedLots = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: COLUMNS_DESERT_LOTS,
    };

    this.settingsCustomerBanks = {
      ...TABLE_SETTINGS,
      rowClassFunction: (row: any) => {
        if (['1', '3'].includes(row.data.id_tipo_disp)) {
          if (row.data.available) {
            return 'idDisp';
          } else {
            return 'notAS idDisp';
          }
        } else {
          if (row.data.available) {
            return '';
          } else {
            return 'notAS';
          }
        }
      },
      actions: false,
      columns: COLUMNS_CUSTOMER_BANKS,
    };

    this.settingsLotsBanks = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: COLUMNS_LOTS_BANKS,
    };

    this.settingsPaymentLots = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: COLUMNS_PAYMENT_LOT,
    };
  }

  //Inicializa forma
  private initialize() {
    //TODO: Select que desencripta

    this.validateUser();
  }

  //Valida usuario
  private async validateUser() {
    let n_Cont: number = null;
    let n_Cons: number = null;
    let c_Username: string = null;

    const token = this.authService.decodeToken();
    c_Username = token.preferred_username.toUpperCase();

    await this.paymentService.getComerReldisDisp().subscribe(
      res => {
        n_Cont = res.count;
      },
      err => {
        n_Cons = 0;
      }
    );

    const paramsF = new FilterParams();
    paramsF.addFilter('user', c_Username);
    paramsF.addFilter('sirsaeUser', null, SearchFilter.NOT);

    await this.securityService
      .getAllUsersTracker(paramsF.getParams())
      .subscribe(
        res => {
          console.log(res);
          n_Cons = res.count;
        },
        err => {
          n_Cons = 0;
        }
      );

    if (n_Cont == 0 && n_Cons > 0) {
      this.txt_usu_valido = c_Username;
    }

    const paramsF2 = new FilterParams();
    paramsF2.addFilter('parameter', 'SUPUSUCOMER');
    paramsF2.addFilter('value', c_Username);

    this.parametersModService.getParamterMod(paramsF2.getParams()).subscribe(
      res => {
        n_Cont = res.count;
      },
      err => {
        n_Cont = 0;
      }
    );

    if (n_Cont > 0) {
      //PB_RELUSU_DIST Activado
      //PB_RELUSU_MAND Activado
    }
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      cveProcess: [null],
      dateEvent: [null],
      dateClose: [null],
      dateFail: [null],
      dateNotification: [null],
      dateMaxWarranty: [null],
      dateMaxPayment: [null],
    });
    //FORMULARIO CLIENTE Y EVENTO
    this.formCustomerEvent = this.fb.group({
      totalAmount: [null],
      devAmount: [null],
      penAmount: [null],
      inProcess: [null],
    });
    //LOTES ASIGNADOS EN EL EVENTO
    this.formLotEvent = this.fb.group({
      finalPrice: [null],
      totalFinalPrice: [null],
      warranty: [null],
      totalWarranty: [null],
      liquidateAmount: [null],
      totalLiquidateAmount: [null],
      inProcess: [null],
      totalTableWarranty: [null],
      totalTableAdvance: [null],
      txtCancel: [null],
    });
    //PAGOS RECIBIDOS EN EL BANCO POR CLIENTE
    this.formCustomerBanks = this.fb.group({
      validAmount: [null],
      total: [null],
    });
    //PAGOS RECIBIDOS EN EL BANCO POR LOTE
    this.formLotsBanks = this.fb.group({
      validAmount: [null],
      total: [null],
    });
    //COMPOSICIÓN DE PAGOS RECIBIDOS POR LOTES
    this.formPaymentLots = this.fb.group({
      totalWithIva: [null],
      totalIva: [null],
      totalWithoutIva: [null],
      totalSum: [null],
    });
    //OPCIONES SIRSAE
    this.formSirsae = this.fb.group({
      maxDateSirsae: [null],
      reference: [null],
    });
    //RADIO BUTTONS
    this.formRbButton = this.fb.group({
      definitive: ['N'],
      allBatch: ['N'],
    });
  }

  //Gets
  get event() {
    return this.form.get('event');
  }

  get cveProcess() {
    return this.form.get('cveProcess');
  }

  get dateEvent() {
    return this.form.get('dateEvent');
  }

  get dateClose() {
    return this.form.get('dateClose');
  }

  get dateFail() {
    return this.form.get('dateFail');
  }

  get dateNotification() {
    return this.form.get('dateNotification');
  }

  get dateMaxWarranty() {
    return this.form.get('dateMaxWarranty');
  }

  get dateMaxPayment() {
    return this.form.get('dateMaxPayment');
  }

  //Limpiar tablas
  cleanAllTables() {
    this.dataCustomer.load([]);
    this.dataLotEvent.load([]);
    this.dataDesertedLots.load([]);
    this.dataCustomerBanks.load([]);
    this.dataLotsBanks.load([]);
    this.dataPaymentLots.load([]);
  }

  //Seleccionar eventos
  selectEvent() {
    this.cleanAllTables();
    this.loadingCustomer = true;
    this.loadingLotEvent = true;
    this.loadingDesertLots = true;
    /* this.loadingLotBanks = true; */
    /* this.loadingPaymentLots = true; */
    const paramsF = new FilterParams();
    paramsF.addFilter('id', this.event.value);
    console.log(this.event.value);
    this.comerEventService.getAllFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        const resp = res['data'][0];
        this.cveProcess.setValue(resp.processKey);
        this.dateEvent.setValue(resp.eventDate);
        this.dateClose.setValue(resp.eventClosingDate);
        this.dateFail.setValue(resp.failureDate);
        this.dateNotification.setValue(resp.notificationDate);
        this.dateMaxWarranty.setValue(resp.processKey);
        this.dateMaxPayment.setValue(resp.processKey);
        this.postQueryEvent(
          resp.eventTpId,
          resp.statusVtaId,
          resp.address,
          resp.failureDate,
          resp.eventClosingDate,
          resp.notificationDate
        );
        this.statusVtaId = resp.statusVtaId;
        this.eventManagement = resp.address == 'M' ? 'MUEBLES' : 'INMUEBLES';
        this.getDataComerCustomer();
        this.getDataLotes(resp.id);
        this.getDataDesertLots(resp.id);
      },
      err => {
        console.log(err);
        this.loadingCustomer = false;
        this.loadingLotEvent = false;
        this.loadingDesertLots = false;
        this.loadingLotBanks = false;
        this.loadingPaymentLots = false;
      }
    );
  }

  //POSTQUERY del Evento
  postQueryEvent(
    eventTpId: string,
    salesStatusId: string,
    address: string,
    failDate: string,
    closeDate: string,
    notifyDate: string | Date
  ) {
    const paramsF = new FilterParams();
    paramsF.addFilter('id', eventTpId);
    this.comerTpEventsService.getAllComerTpEvent(paramsF.getParams()).subscribe(
      res => {
        this.eventType = res['data'][0].description;
      },
      err => {
        this.eventType = 'SIN DESCRIPCION';
      }
    );

    const paramsF2 = new FilterParams();
    paramsF2.addFilter('salesStatusId', salesStatusId);
    this.parametersModService
      .getParameterStatus(paramsF2.getParams())
      .subscribe(
        res => {
          this.statusEvent = res.data[0].description;
        },
        err => {
          this.statusEvent = 'SIN DESCRIPCION';
        }
      );

    const model = {
      pDirection: address,
      pEventKey: eventTpId,
    };

    this.comerTpEventsService.getTpEvent(model).subscribe(
      res => {
        console.log(res);
        this.id_tipo_disp = res.data[0].id_tipo_disp;
        if ([1, 3].includes(this.id_tipo_disp)) {
          console.log('Entra');
          this.availableByTypeSettingFalse();
          this.isAvailableByType = false;
        } else {
          this.availableByTypeSettingTrue();
          this.isAvailableByType = true;
        }
      },
      err => {
        console.log(err);
      }
    );

    //Parte final del postquery
    const modelWarranty: IGraceDate = {
      param: 'GCE',
      typeEvent: eventTpId,
      address: address,
      closeEventDate: closeDate,
      faildDate: failDate,
      notificationDate: notifyDate != null ? notifyDate.toString() : notifyDate,
    };

    const modelPayment: IGraceDate = {
      param: 'LIQE',
      typeEvent: eventTpId,
      address: address,
      closeEventDate: closeDate,
      faildDate: failDate,
      notificationDate: notifyDate != null ? notifyDate.toString() : notifyDate,
    };

    this.comerEventosService.pufGraceDate(modelWarranty).subscribe(
      res => {
        console.log(res);
        this.dateMaxWarranty.setValue(
          new Date(this.correctDate(res.fecha_habil))
        );
      },
      err => {
        console.log(err);
      }
    );

    this.comerEventosService.pufGraceDate(modelPayment).subscribe(
      res => {
        console.log(res);
        this.dateMaxPayment.setValue(
          new Date(this.correctDate(res.fecha_habil))
        ); //TODO: Hay que corregir según un endpoint
      },
      err => {
        console.log(err);
      }
    );

    //TODO: Falta endpoint de insert
  }

  //Cambiar los settings de las tablas
  availableByTypeSettingFalse() {
    setCheckHide(true);
    this.settingsCustomer = {
      rowClassFunction: (row: { data: { available: any } }) =>
        row.data.available ? 'bg-success text-white' : 'bg-dark text-white',
      ...TABLE_SETTINGS,
      actions: false,
      columns: {
        ...COLUMNSCUSTOMER,
      },
    };
  }

  availableByTypeSettingTrue() {
    setCheckHide(false);
    this.settingsCustomer = {
      rowClassFunction: (row: { data: { available: any } }) =>
        row.data.available ? 'bg-success text-white' : 'bg-dark text-white',
      ...TABLE_SETTINGS,
      actions: false,
      columns: {
        ...COLUMNSCUSTOMER,
      },
    };
  }
  //Data de COMER_CLIENTESXEVENTO
  getDataComerCustomer() {
    clearGoodCheckCustomer();
    this.loadingCustomer = true;
    const paramsF = new FilterParams();
    paramsF.addFilter('EventId', this.event.value);
    if (this.dataCustomer['data'].length > 0) {
      paramsF.page = this.paramsCustomer.value.page;
      paramsF.limit = this.paramsCustomer.value.limit;
    }
    //SentToSIRSAE
    console.log(this.formCustomerEvent.get('inProcess').value);
    this.formCustomerEvent.get('inProcess').value
      ? paramsF.addFilter('SentToSIRSAE', 'S')
      : '';
    this.comerTpEventsService.getTpEvent2(paramsF.getParams()).subscribe(
      async res => {
        const newData = await Promise.all(
          res.data.map(async (e: any) => {
            let disponible: boolean;
            const validate = await this.postqueryComerCustomer(e);
            disponible = JSON.parse(JSON.stringify(validate)).available;
            return {
              ...e,
              available: disponible,
            };
          })
        );

        //TODO: SUMATORIAS PARA TOTALES
        console.log(newData);
        this.dataCustomer.load(newData);
        this.totalItemsCustomer = res.count;
        this.loadingCustomer = false;
      },
      err => {
        this.loadingCustomer = false;
        this.dataCustomer.load([]);
        if (err.status == 400) {
          this.formCustomerEvent.get('inProcess').value
            ? this.alert(
                'warning',
                'No se encontrarón Clientes Participantes para el Evento con Proceso S',
                ''
              )
            : this.alert(
                'warning',
                'No se encontrarón Clientes Participantes para el Evento',
                ''
              );
        } else {
          this.alert('error', 'Se presentó un Error Inesperado', '');
        }
      }
    );
  }

  //REFRESCAR COMER_CLIENTESXEVENTO
  refreshComerCustomer() {
    this.getDataComerCustomer();
  }

  //Postquery COMER_CLIENTESXEVENTO
  postqueryComerCustomer(item: any) {
    return new Promise((resolve, reject) => {
      if ([1, 3].includes(this.id_tipo_disp)) {
        if (item.SentToSIRSAE == 'S') {
          resolve({ available: false });
        } else if (item.SendToSIRSAE == 'S') {
          resolve({ available: true });
        } else {
          resolve({ available: false });
        }
      } else {
        resolve({ available: true });
      }
    });
  }

  //LOTES
  getDataLotes(eventId: string | number) {
    const paramsF = new FilterParams();
    paramsF.addFilter('eventId', eventId);
    paramsF.addFilter('clientId', null, SearchFilter.NOT);
    this.comerLotsService
      .getComerLotsClientsPayref(paramsF.getParams())
      .subscribe(
        async res => {
          console.log(res);
          this.comerLotsService.comerLotsClientsPayrefSum(eventId).subscribe(
            res => {
              console.log(res)
              this.formLotEvent.get('totalTableWarranty').setValue(res.data[0].sumPriceWarranty)
              this.formLotEvent.get('totalTableAdvance').setValue(res.data[0].sumAnticipate)
              this.formLotEvent.get('totalFinalPrice').setValue(res.data[0].sumPriceEnd)
              this.formLotEvent.get('totalWarranty').setValue(res.data[0].sumWarrantyAssig)
              this.formLotEvent.get('totalLiquidateAmount').setValue(res.data[0].sumAmountLiq)
            },
            err => {
              console.log(err)
            }
          )

          const newData = await Promise.all(
            res.data.map(async (e: any) => {
              let disponible: boolean;
              const validate = await this.postQueryLots(e);
              disponible = JSON.parse(JSON.stringify(validate)).available;
              return {
                ...e,
                available: disponible,
                txtCan:
                  e.exceedsLack == 1 ? 'Lote Cancelado por el Usuario' : '',
              };
            })
          );
          console.log(newData);
          this.dataLotEvent.load(newData);
          this.totalItemsLotEvent = res.count;
          this.loadingLotEvent = false;
        },
        err => {
          console.log(err);
          this.loadingLotEvent = false;
          this.dataLotEvent.load([]);
          this.totalItemsLotEvent = 0;
        }
      );
  }

  //POSQUERY LOTES  
  postQueryLots(e: any) {
    return new Promise((resolve, reject) => {
      if (this.id_tipo_disp == 2) {
        if (['PAG', 'PAGE', 'CAN', 'GARA', 'DES'].includes(e.vtaStatusId)) {
          let n_cont: number = 0;
          let n_coni: number = 0;
          let n_sum_pag: number = 0;
          //TODO
          // BEGIN
          //       SELECT SUM(IVA+MONTO_APP_IVA+MONTO_NOAPP_IVA)
          //         INTO n_SUM_PAG
          //         FROM COMER_PAGOSREFGENS
          //        WHERE ID_LOTE = :COMER_LOTES.ID_LOTE
          //          AND TIPO = 'N';
          //    EXCEPTION
          //       WHEN OTHERS THEN
          //          n_SUM_PAG := 0;
          //    END;
          //TODO
          // SELECT COUNT(0), COUNT(IDORDENINGRESO)
          //      INTO n_CONT, n_CONI
          //      FROM COMER_PAGOREF CP
          //     WHERE EXISTS (SELECT 1
          //                     FROM COMER_PAGOREF_VIRT VI
          //                    WHERE VI.ID_PAGO = CP.ID_PAGO
          //                      AND ID_LOTE = :COMER_LOTES.ID_LOTE)
          //       AND VALIDO_SISTEMA = 'S';
          if (
            (n_cont > 0 && n_cont == n_coni && n_sum_pag >= e.finalPrice) ||
            (e.vtaStatusId == 'CAN' && n_cont == n_coni)
          ) {
            this.settingsLotEvent = {
              ...TABLE_SETTINGS,
              rowClassFunction: (row: { data: { available: any } }) =>
                row.data.available
                  ? 'bg-success text-white'
                  : 'bg-dark text-white',
              actions: false,
              columns: COLUMNS_LOT_EVENT_FALSE,
            };
            resolve({ available: false });
          } else {
            this.settingsLotEvent = {
              ...TABLE_SETTINGS,
              rowClassFunction: (row: { data: { available: any } }) =>
                row.data.available
                  ? 'bg-success text-white'
                  : 'bg-dark text-white',
              actions: false,
              columns: COLUMNS_LOT_EVENT_TRUE
            };
            resolve({ available: true });
          }
        } else {
          this.settingsLotEvent = {
            ...TABLE_SETTINGS,
            rowClassFunction: (row: { data: { available: any } }) =>
              row.data.available
                ? 'bg-success text-white'
                : 'bg-dark text-white',
            actions: false,
            columns: COLUMNS_LOT_EVENT_TRUE
          };
          resolve({ available: true });
        }
      } else {
        this.settingsLotEvent = {
              ...TABLE_SETTINGS,
              rowClassFunction: (row: { data: { available: any } }) =>
                row.data.available
                  ? 'bg-success text-white'
                  : 'bg-dark text-white',
              actions: false,
              columns: COLUMNS_LOT_EVENT_TRUE
            };
        resolve({ available: true });
      }
    });
  }

  //LOTES DESIERTOS
  getDataDesertLots(eventId: string | number) {
    const paramsF = new FilterParams();
    paramsF.addFilter('eventId', eventId);
    this.comerLotsService
      .getAllComerLotsFilter(`${paramsF.getParams()}&filter.idClient=$null`)
      .subscribe(
        res => {
          console.log(res);
          this.dataDesertedLots.load(res.data);
          this.totalItemsDesertedLots = res.count;
          this.loadingDesertLots = false;
        },
        err => {
          console.log(err);
          this.dataDesertedLots.load([]);
          this.totalItemsDesertedLots = 0;
          this.loadingDesertLots = false;
        }
      );
  }

  //SELECCIONAR CLIENTES PARTICIPANTES EN EL EVENTO
  selectRowClientEvent(e: any) {
    console.log(e.data);
    this.loadingCustomerBanks = true;
    this.idClientCustomer = e.data.ClientId;
    this.getPaymentByCustomer(e.data.ClientId, e.data.EventId);
    this.getTotalSums(e);
  }

  //TOTALES DE CLIENTES PARTICIPANTES EN EL EVENTO
  getTotalSums(e: any) {
    const model = {
      clientId: e.data.ClientId,
      eventId: e.data.EventId,
    };

    this.comerEventosService.getAmountsMtodisp(model).subscribe(
      res => {
        console.log(res);
        this.formCustomerEvent.get('totalAmount').setValue(res.STOT);
        this.formCustomerEvent.get('devAmount').setValue(res.SPD);
        this.formCustomerEvent.get('penAmount').setValue(res.SPP);
      },
      err => {
        console.log(err);
        this.formCustomerEvent.get('totalAmount').reset();
        this.formCustomerEvent.get('devAmount').reset();
        this.formCustomerEvent.get('penAmount').reset();
      }
    );
  }

  //SELECCIONAR REGISTRO LOTES ASIGNADOS EN EL EVENTO
  selectRowLotsEvent(e: any) {
    console.log(e.data);
    this.formLotEvent.get('finalPrice').setValue(e.data.finalPrice);
    this.formLotEvent.get('warranty').setValue(e.data.guaranteePrice);
    this.formLotEvent.get('liquidateAmount').setValue(e.data.liquidationAmount);
    this.formLotEvent.get('txtCancel').setValue(e.data.txtCan);
    this.getLotsBanks(e.data.lotId);
    this.getPaymentLots(e.data.lotId);
  }

  //DATOS DE PAGOS RECIBIDOS EN EL BANCO POR CLIENTE
  getPaymentByCustomer(clientId: string, eventId: string) {
    console.log(this.id_tipo_disp);
    if (['1', '3'].includes(this.id_tipo_disp.toString())) {
      console.log('Entra');
    } else {
      console.log('No entra');
    }

    this.loadingValidAmount = true;
    this.loadingTotal = true;

    const paramsF = new FilterParams();
    paramsF.addFilter('Customer_ID', clientId);
    paramsF.addFilter('Event_ID', eventId);
    this.comerLotsService.getLotComerPayRef(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        const newData = res.data.map((e: any) => {
          return {
            ...e,
            available: ['A', 'S'].includes(e.System_Valid) ? true : false,
            id_tipo_disp: this.id_tipo_disp,
          };
        });
        this.dataCustomerBanks.load(newData);
        this.totalItemsCustomerBanks = res.count;
        this.loadingCustomerBanks = false;
      },
      err => {
        console.log(err);
        this.loadingCustomerBanks = false;
        this.dataCustomerBanks.load([]);
        this.totalItemsCustomerBanks = 0;
      }
    );

    const model = {
      dateComer: format(this.dateMaxWarranty.value, 'yyyy-MM-dd'),
      clientId: clientId,
      eventId: eventId,
    };

    this.comerLotsService.getSumLotComerPayRef(model).subscribe(
      res => {
        console.log(res);
        this.formCustomerBanks
          .get('validAmount')
          .setValue(res.data[0].suma_total);
        this.loadingValidAmount = false;
      },
      err => {
        console.log(err);
        this.loadingValidAmount = false;
      }
    );

    const model2 = {
      clientId: clientId,
      eventId: eventId,
    };

    this.comerLotsService.getSumAllComerPayRef(model2).subscribe(
      res => {
        console.log(res);
        this.formCustomerBanks.get('total').setValue(res.data[0].suma_total);
        this.loadingTotal = false;
      },
      err => {
        console.log(err);
        this.loadingTotal = false;
      }
    );
  }

  //POSQUERY PAGOS RECIBIDOS EN EL BANCO POR CLIENTE
  postqueryPaymentByCustomer() {}

  //DATOS DE PAGOS RECIBIDOS EN EL BANCO POR LOTE
  getLotsBanks(idLote: string) {
    this.loadingLotBanks = true;
    const paramsF = new FilterParams();
    paramsF.addFilter('SystemValid', 'R,D,B', SearchFilter.NOTIN);
    paramsF.addFilter('BatchID', idLote);
    this.paymentService.getComerPaymentRef(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.dataLotsBanks.load(res.data);
        this.totalItemsLotsBanks = res.count;
        this.loadingLotBanks = false;
      },
      err => {
        console.log(err);
        this.dataLotsBanks.load([]);
        this.totalItemsLotsBanks = 0;
        this.loadingLotBanks = false;
      }
    );
  }

  //POSTQUERY DE PAGOS RECIBIDOS EN EL BANCO POR LOTE
  postqueryLotBanks() {}

  //DATOS DE COMPOSICIÓN DE PAGOS RECIBIDOS POR LOTE
  getPaymentLots(lotId: string) {
    this.loadingPaymentLots = true;
    const paramsF = new FilterParams();
    paramsF.addFilter('lotId', lotId);
    this.spentService.getAllComerPagosRef(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.dataPaymentLots.load(res.data);
        this.totalItemsPaymentLots = res.count;
        this.loadingPaymentLots = false;
      },
      err => {
        console.log(err);
        this.dataPaymentLots.load([]);
        this.totalItemsPaymentLots = 0;
        this.loadingPaymentLots = false;
      }
    );
  }

  //!EXCELS
  //Descargar Excel
  downloadDocument(
    filename: string,
    documentType: string,
    base64String: string
  ): void {
    console.log(this.form.value);
    let documentTypeAvailable = new Map();
    documentTypeAvailable.set(
      'excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    documentTypeAvailable.set(
      'word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    documentTypeAvailable.set('xls', '');

    let bytes = this.base64ToArrayBuffer(base64String);
    let blob = new Blob([bytes], {
      type: documentTypeAvailable.get(documentType),
    });
    let objURL: string = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = objURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this._toastrService.clear();
    this.loadingExcel = false;
    this.alert('success', 'Reporte Excel', 'Descarga Finalizada');
    URL.revokeObjectURL(objURL);
  }

  base64ToArrayBuffer(base64String: string) {
    let binaryString = window.atob(base64String);
    let binaryLength = binaryString.length;
    let bytes = new Uint8Array(binaryLength);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  //Exportar a Excel de Ventas Vs. Pagos
  exportExcelSellPayment() {
    this.loadingExcel = true;

    const body = {
      pEventKey: this.event.value,
    };

    this.comerEventosService.pupExpxcVenvspag(body).subscribe(
      res => {
        console.log(res);
        this.downloadDocument('VENTAS VS PAGOS', 'excel', res.base64File);
      },
      err => {
        console.log(err);
        this.loadingExcel = false;
        this.alert(
          'error',
          'Se Presentó un Error Inesperado al Generar Excel',
          'Por favor inténtelo nuevamente'
        );
      }
    );
  }

  exportPaymentDetail() {
    this.loadingExcel = true;

    const body = {
      pEventKey: this.event.value,
    };

    this.comerEventosService.pupExpExcel(body).subscribe(
      res => {
        console.log(res);
        this.downloadDocument('DETALLE DE LOS PAGOS', 'excel', res.base64File);
      },
      err => {
        console.log(err);
        this.loadingExcel = false;
        this.alert(
          'error',
          'Se Presentó un Error Inesperado al Generar Excel',
          'Por favor inténtelo nuevamente'
        );
      }
    );
  }

  exportPaymentWithoutStatus() {
    this.loadingExcel = true;

    const body = {
      pEventKey: this.event.value,
    };

    this.comerEventosService.pupExpPayModest(body).subscribe(
      res => {
        console.log(res);
        this.downloadDocument('DETALLE DE LOS PAGOS', 'excel', res.base64File);
      },
      err => {
        console.log(err);
        this.loadingExcel = false;
        this.alert(
          'error',
          'Se Presentó un Error Inesperado al Generar Excel',
          'Por favor inténtelo nuevamente'
        );
      }
    );
  }

  exportPaymentAndLots() {
    this.loadingExcel = true;

    const body = {
      pEventKey: this.event.value,
      pType: 1,
    };

    this.comerEventosService.pupExportDetpayments(body).subscribe(
      res => {
        console.log(res);
        this.downloadDocument('PAGOS VS LOTES', 'excel', res.base64File);
      },
      err => {
        console.log(err);
        this.loadingExcel = false;
        this.alert(
          'error',
          'Se Presentó un Error Inesperado al Generar Excel',
          'Por favor inténtelo nuevamente'
        );
      }
    );
  }

  //Seleccionar PAGOREF_CLI
  selectRowCustomerBanks(e: any) {
    console.log(e.data);
    this.dataBatch = e.data;
    this.idBatch = e.data.batchId;
  }

  //Correct Date
  correctDate(date: string) {
    const dateUtc = new Date(date);
    return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
  }

  //Función de pagos
  unbundlePaymentsFn() {
    let rfc: any = null;
    let client: any = null;
    let reference: any = this.dataBatch.reference;
    let amount: any = this.dataBatch.amount;
    let idPayment: any = this.dataBatch.Payment_ID;
    let idBatch: any = this.dataBatch.batchId;
    let incomeOrderId: any = this.dataBatch.Income_Order_ID;
    let date: any = this.correctDate(this.dataBatch.date);
    let dateMaxPay: any = this.dateMaxPayment.value;
    let eventId: any = this.dataBatch.Event_ID;
    let customerBatch: any = this.dataBatch.Customer_ID;
    return new Promise((resolve, reject) => {
      if (this.event.value != null) {
        if (this.idBatch != null) {
          const paramsF = new FilterParams();
          paramsF.addFilter('id', this.dataBatch.Customer_ID);
          this.customersService
            .getAllWithFilters(paramsF.getParams())
            .subscribe(
              res => {
                console.log(res);
                rfc = res['data'][0].rfc;
                client = res['data'][0].reasonName;
                console.log({ rfc, client });
                //PENALIZACIÓN
                this.depositaryService
                  .getComerDetLcGrief(this.dataBatch.reference)
                  .subscribe(
                    res => {
                      console.log(res);
                      resolve({
                        rfc,
                        client,
                        reference,
                        amount,
                        idPayment,
                        idBatch,
                        incomeOrderId,
                        date,
                        dateMaxPay,
                        eventId,
                        customerBatch,
                        penaltyAmount: res.data[0].mountgrief,
                      });
                    },
                    err => {
                      resolve({
                        rfc,
                        client,
                        reference,
                        amount,
                        idPayment,
                        idBatch,
                        incomeOrderId,
                        date,
                        dateMaxPay,
                        eventId,
                        customerBatch,
                        penaltyAmount: 0,
                      });
                    }
                  );
              },
              err => {
                console.log(err);
              }
            );
        }
      }
    });
  }

  //Abrir modal de Pagos
  async unbundlePayments() {
    if (this.dataBatch != null) {
      const dataModel = await this.unbundlePaymentsFn();
      let modalConfig = MODAL_CONFIG;
      modalConfig = {
        initialState: {
          dataModel,
          dateWarrantyLiq: this.form.get('dateMaxPayment').value,
          callback: (e: any) => {
            console.log(e);
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };

      this.modalService.show(ComerPaymentVirtComponent, modalConfig);
    } else {
      this.alert(
        'warning',
        'Debe Seleccionar un Pago Recibido en el Banco por Cliente',
        ''
      );
    }
  }

  //Enviar a SIRSAE
  sendToSirsae() {
    if (this.txt_usu_valido != null) {
      this.alertQuestion(
        'question',
        '¿Desea Ejecutar el Proceso de Envío a SIRSAE?',
        '',
        'Continuar'
      ).then(q => {
        if (q.isConfirmed) {
          //TODO: PUP_PROC_ENV_SIRSAE
        }
      });
    } else {
      this.alert('warning', 'Usuario sin Permisos de Envío a SIRSAE', '');
      let token = this.authService.decodeToken();
      console.log(token);
      let modalConfig = MODAL_CONFIG;
      modalConfig = {
        initialState: {
          user: token.preferred_username,
          callback: (e: any) => {
            console.log(e);
          },
        },
        class: 'modal-dialog-centered',
        ignoreBackdropClick: true,
      };

      this.modalService.show(CanUsuSirsaeComponent, modalConfig);
    }
  }

  //Ejecutar dispersión
  executeScattering() {
    this.alertQuestion(
      'question',
      '¿Desea Ejecutar el Proceso de Dispersión?',
      '',
      'Ejecutar'
    ).then(q => {
      if (q.isConfirmed) {
        //TODO: PUP_PROC_DISP
        const model = {
          typeDispId: this.id_tipo_disp,
          comerEventsEventId: this.form.get('event').value,
          address: this.eventManagement == 'MUEBLES' ? 'M' : 'I',
          rgTotalLots: this.formRbButton.get('allBatch').value,
          PROCESAR: '',
          typeProcess: this.formRbButton.get('deinitive').value,
        };
        console.log(model);
        /* this.comerLotsService.pupProcDisp(); */
      }
    });
  }

  //Reprocesar Dispersión
  reprocessScattering() {
    if (this.id_tipo_disp != null) {
      let c_message = [1, 3].includes(this.id_tipo_disp)
        ? '¿Desea Ejecutar el Reproceso de Clientes?'
        : '¿Desea Ejecutar el Reproceso de Lotes?';

      this.alertQuestion('question', c_message, '', 'Ejecutar').then(q => {
        if (q.isConfirmed) {
          //TODO: PUP_PROC_REPROC
        }
      });
    } else {
      const element = document.getElementById('event');
      console.log(element);
      if (element) {
        element.scrollIntoView({ block: 'center', behavior: 'smooth' });
        this.event.markAsTouched();
      }
    }
  }

  //Propuesta de Dispersión
  proposalScattering() {
    this.alertQuestion(
      'question',
      '¿Desea Ejecutar el Proceso de Propuesta?',
      '',
      'Ejecutar'
    ).then(q => {
      if (q.isConfirmed) {
        const model: IPupProcSeldisp = {
          saleStatusId: this.statusVtaId,
          typeDispId: this.id_tipo_disp,
          totalAmount: '',
          totalClient: '',
          comerClientXEventsEventId: this.event.value,
          dateGraceLiq: '',
        };
      }
    });
  }

  //Propuesta de envío a SIRSAE
  proposalSendSirsae() {
    this.alertQuestion(
      'question',
      '¿Desea Ejecutar el Proceso de Propuesta?',
      '',
      'Ejecutar'
    ).then(q => {
      if (q.isConfirmed) {
        //TODO: PUP_PROC_SELSIRSAE
      }
    });
  }

  //Propuesta de Reproceso
  proposalReprocess() {
    this.alertQuestion(
      'question',
      '¿Desea Ejecutar el Proceso de Propuesta?',
      '',
      'Ejecutar'
    ).then(q => {
      if (q.isConfirmed) {
        //TODO: PUP_PROC_SELREPROCESO
      }
    });
  }

  //Pagos SIRSAE
  sirsaePayment() {
    let modalConfig = MODAL_CONFIG;
    modalConfig = {
      initialState: {
        idEvent: this.event.value,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };

    this.modalService.show(CanPagosCabComponent, modalConfig);
  }

  //Garantías y LCs
  warrantyLcs() {
    let modalConfig = MODAL_CONFIG;
    modalConfig = {
      initialState: {
        idEvent: this.event.value,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };

    this.modalService.show(CanLcsWarrantyComponent, modalConfig);
  }

  //Usuario Distribución
  distributionUser() {
    let modalConfig = MODAL_CONFIG;
    modalConfig = {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };

    this.modalService.show(CanRelusuComponent, modalConfig);
  }

  //Actualizar No de OIs
  updateNumberOis() {
    this.alertQuestion(
      'question',
      '¿Desea Ejecutar el Proceso de Actualización de Números de Órdenes de Ingreso?',
      '',
      'Ejecutar'
    ).then(q => {
      if (q.isConfirmed) {
        let body: ISendSirsaeLot = {};
        //TODO
        this.interfaceSirsaeService.sendSirsaeLot(body).subscribe(
          res => {
            console.log(res);
          },
          err => {
            console.log(err);
            this.alert('error', 'Se Presentó un Error Inesperado', '');
          }
        );
      }
    });
  }

  //Cargar pagos
  chargePayments() {
    localStorage.setItem('eventId_dispersion', this.event.value);
    this.router.navigate(['/pages/commercialization/referenced-payment/M'], {
      queryParams: { origin: 'FCOMER_MTODISP' },
    });
  }

  //PRUEBA MAND
  testSend() {
    //TODO: PUP_VALIDA_MANDATO_NFAC
    if (this.event.value != null && this.id_tipo_disp != null) {
      const model: IPupValidateMandatoNfac = {
        id_tipo_disp: this.id_tipo_disp,
        id_evento: this.event.value,
      };

      this.comerLotsService.pupValidaMandatoNfac(model).subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
    }
  }
}

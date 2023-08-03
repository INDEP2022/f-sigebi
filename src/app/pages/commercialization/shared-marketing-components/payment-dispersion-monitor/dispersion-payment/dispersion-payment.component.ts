import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { SpentService } from 'src/app/core/services/ms-spent/comer-expenses.service';
import { BasePage } from 'src/app/core/shared';
import { clearGoodCheckCustomer } from '../dispersion-payment-details/customers/columns';
import {
  COLUMNSCUSTOMER,
  COLUMNS_CUSTOMER_BANKS,
  COLUMNS_DESERT_LOTS,
  COLUMNS_LOTS_BANKS,
  COLUMNS_LOT_EVENT,
  COLUMNS_PAYMENT_LOT,
  setCheckHide,
} from './columns';

@Component({
  selector: 'app-dispersion-payment',
  templateUrl: './dispersion-payment.component.html',
  styles: [],
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

  loadingExcel = false;

  form: FormGroup;
  formCustomerEvent: FormGroup;
  formLotEvent: FormGroup;
  formDesertLots: FormGroup;
  formCustomerBanks: FormGroup;
  formLotsBanks: FormGroup;
  formPaymentLots: FormGroup;

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

  isAvailableByType: boolean = true;

  private clie_procesar: boolean = false;
  private lot_procesar: boolean = false;
  private clie_solo_pend: boolean = false;
  private lot_solo_pend: boolean = false;

  private txt_usu_valido: string = null;
  private id_tipo_disp: number = null;

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
    private customersService: ComerClientsService
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
      columns: COLUMNS_LOT_EVENT,
    };

    this.settingsDesertedLots = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: COLUMNS_DESERT_LOTS,
    };

    this.settingsCustomerBanks = {
      ...TABLE_SETTINGS,
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

  //Seleccionar eventos
  selectEvent() {
    this.loadingCustomer = true;
    this.loadingLotEvent = true;
    this.loadingDesertLots = true;
    this.loadingCustomerBanks = true;
    this.loadingLotBanks = true;
    this.loadingPaymentLots = true;
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
        this.postQueryEvent(resp.eventTpId, resp.statusVtaId, resp.address);
        this.eventManagement = resp.address == 'M' ? 'MUEBLES' : 'INMUEBLES';
        this.getDataComerCustomer();
        this.getDataLotes(resp.id);
        this.getDataDesertLots(resp.id);
      },
      err => {
        console.log(err);
      }
    );
  }

  //POSTQUERY del Evento
  postQueryEvent(eventTpId: string, salesStatusId: string, address: string) {
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
    this.dateMaxWarranty.setValue(new Date()); //TODO: Hay que corregir según un endpoint
    this.dateMaxPayment.setValue(new Date()); //TODO: Hay que corregir según un endpoint

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
    this.loading = true;
    const paramsF = new FilterParams();
    paramsF.addFilter('EventId', this.event.value);
    if (this.dataCustomer['data'].length > 0) {
      paramsF.page = this.paramsCustomer.value.page;
      paramsF.limit = this.paramsCustomer.value.limit;
    }
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

        this.dataCustomer.load(newData);
        this.totalItemsCustomer = res.count;
        this.loadingCustomer = false;
      },
      err => {
        this.loadingCustomer = false;
        if (err.status == 400) {
          this.alert(
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
            resolve({ available: false });
          } else {
            resolve({ available: true });
          }
        }
      } else {
        resolve({ available: false });
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
    this.getPaymentByCustomer(e.data.ClientId);
  }

  //SELECCIONAR REGISTRO LOTES ASIGNADOS EN EL EVENTO
  selectRowLotsEvent(e: any) {
    console.log(e.data);
    this.formLotEvent.get('finalPrice').setValue(e.data.finalPrice)
    this.formLotEvent.get('warranty').setValue(e.data.guaranteePrice)
    this.formLotEvent.get('liquidateAmount').setValue(e.data.liquidationAmount)
    this.formLotEvent.get('txtCancel').setValue(e.data.txtCan)
    this.getLotsBanks(e.data.lotId);
    this.getPaymentLots(e.data.lotId);
  }

  //DATOS DE PAGOS RECIBIDOS EN EL BANCO POR CLIENTE
  getPaymentByCustomer(clientId: string) {
    const paramsF = new FilterParams();
    paramsF.addFilter('Customer_ID', clientId);
    this.comerLotsService.getLotComerPayRef(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.dataCustomerBanks.load(res.data);
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
  }

  //DATOS DE PAGOS RECIBIDOS EN EL BANCO POR LOTE
  getLotsBanks(idLote: string) {
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

  //DATOS DE COMPOSICIÓN DE PAGOS RECIBIDOS POR LOTE
  getPaymentLots(lotId: string) {
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
      }
    );
  }
}

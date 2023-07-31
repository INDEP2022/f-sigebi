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
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared';
import { clearGoodCheckCustomer } from '../dispersion-payment-details/customers/columns';
import { COLUMNSCUSTOMER, COLUMNS_LOT_EVENT, setCheckHide } from './columns';

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
  settingsCustomerBanks = this.settings
  settingsLotsBanks = this.settings
  settingsPaymentLots = this.settings

  form: FormGroup;
  formCustomerEvent: FormGroup;
  formLotEvent: FormGroup;
  formDesertLots: FormGroup;
  formCustomerBanks: FormGroup
  formLotsBanks: FormGroup
  formPaymentLots: FormGroup

  statusEvent: string = null;
  eventType: string = null;
  eventManagement: string = null;

  dataCustomer = new LocalDataSource();
  dataLotEvent = new LocalDataSource();
  dataDesertedLots = new LocalDataSource();
  dataCustomerBanks = new LocalDataSource();
  dataLotsBanks = new LocalDataSource();

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private paymentService: PaymentService,
    private securityService: SecurityService,
    private parametersModService: ParameterModService,
    private comerEventService: ComerEventService,
    private comerTpEventsService: ComerTpEventosService,
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
        this.getDataComerCustomer();
      }
    });
  }

  //Preparar Settings
  prepareSettings() {
    this.settingsCustomer = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: COLUMNSCUSTOMER,
    };

    this.settingsLotEvent = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: COLUMNS_LOT_EVENT,
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
    });
    //PAGOS RECIBIDOS EN EL BANCO POR CLIENTE
    this.formCustomerBanks = this.fb.group({
      validAmount: [null],
      total: [null]
    })
    //PAGOS RECIBIDOS EN EL BANCO POR LOTE
    this.formLotsBanks = this.fb.group({
      validAmount: [null],
      total: [null]
    })
    //COMPOSICIÓN DE PAGOS RECIBIDOS POR LOTES
    this.formPaymentLots = this.fb.group({
      totalWithIva: [null],
      totalIva: [null],
      totalWithoutIva: [null],
      totalSum: [null]
    })
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

    this.comerTpEventsService.getTpEvent(model).subscribe()
  }
  //Data de COMER_CLIENTESXEVENTO
  getDateComerCustomer() {
    const paramsF = new FilterParams();
    paramsF.addFilter('EventId', this.event.value);
    this.comerTpEventsService.getTpEvent2(paramsF.getParams()).subscribe(
      res => {
        console.log(res.data[0].id_tipo_disp);
        const id_tipo_disp = res.data[0].id_tipo_disp;
        if ([1, 3].includes(parseInt(id_tipo_disp))) {
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
  }

  //Cambiar los settings de las tablas
  availableByTypeSettingFalse() {
    setCheckHide(true);
    this.settingsCustomer = {
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
      res => {
        console.log(res);
        this.dataCustomer.load(res.data);
        this.totalItemsCustomer = res.count;
        this.loading = false;
      },
      err => {
        this.loading = false;
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

  //Postquery COMER_CLIENTESXEVENTO
  postqueryComerCustomer() {}

  getDataLotes() {}
}

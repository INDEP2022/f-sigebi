import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';

@Component({
  selector: 'app-dispersion-payment',
  templateUrl: './dispersion-payment.component.html',
  styles: [],
})
export class DispersionPaymentComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  statusEvent: string = 'Conciliado a SIRSAE';
  eventType: string = null;
  eventManagement: string = null;

  dataCustomer = new LocalDataSource();
  totalIncome: number;

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
  ) {}

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
    this.initialize();
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
        console.log(res.count);
      },
      err => {
        n_Cons = 0;
        console.log(err);
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
          console.log(err);
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
        console.log(res);
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
        this.postQueryEvent(resp.eventTpId, resp.StatusvtaId);
        this.getDateComerCustomer();
      },
      err => {
        console.log(err);
      }
    );
  }

  //POSTQUERY del Evento
  postQueryEvent(eventTpId: string, salesStatusId: string) {
    const paramsF = new FilterParams();
    paramsF.addFilter('id', eventTpId);
    this.comerTpEventsService.getAllComerTpEvent(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.eventType = res['data'][0].description;
      },
      err => {
        this.eventType = 'SIN DESCRIPCION';
        console.log(err);
      }
    );

    const paramsF2 = new FilterParams();
    paramsF2.addFilter('salesStatusId', salesStatusId);
    this.parametersModService
      .getParameterStatus(paramsF2.getParams())
      .subscribe(
        res => {
          console.log(res);
          this.statusEvent = res['data'][0].description;
        },
        err => {
          this.statusEvent = 'SIN DESCRIPCION';
          console.log(err);
        }
      );
  }

  //Data de COMER_CLIENTESXEVENTO
  getDateComerCustomer() {
    const paramsF = new FilterParams();
    paramsF.addFilter('EventId', this.event.value);
    this.comerTpEventsService.getTpEvent(paramsF.getParams()).subscribe(
      res => {
        console.log(res)
        this.dataCustomer.load(res.data)
        this.totalIncome = res.count
      },
      err => {
        console.log(err)
      }
    )
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { EventRelatedService } from 'src/app/core/services/ms-event-rel/event-rel.service';
import { EventAppService } from 'src/app/core/services/ms-event/event-app.service';
import { ParameterBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-brands.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { secondFormatDate } from 'src/app/shared/utils/date';

@Component({
  selector: 'app-remittance-exportation',
  templateUrl: './remittance-exportation.component.html',
  styles: [],
})
export class RemittanceExportationComponent extends BasePage implements OnInit {
  coordinationsItems = new DefaultSelect();
  selectedCoordination: any = null;

  form: FormGroup = new FormGroup({});
  today: Date;
  maxDate: Date;
  minDate: Date;
  SEM1: number;
  SEM2: number;
  FEC1: Date;
  FEC2: Date;
  ANIO: string;
  FEC3: string;
  USEM: number;
  VALIDO: number = 0;

  aux: number;

  public coordination = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private parameterBrandsService: ParameterBrandsService,
    private authService: AuthService,
    private eventRelatedService: EventRelatedService,
    private eventAppService: EventAppService,
    private comerEventService: ComerEventService
  ) {
    super();
    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getParametersMod();
    //this.getCoordinations({ page: 1, text: '' });
  }

  private prepareForm() {
    this.form = this.fb.group({
      rangeDate: [null, [Validators.required, maxDate(new Date())]],
      coordination: [null, [Validators.required]],
      opcion: [null, [Validators.required]],
      goods: [null, [Validators.required]],
      event: ['', [Validators.required]],
      check1: [null],
      check2: [null],
    });
  }

  /*getCoordinations(params: ListParams) {
    if (params.text == '') {
      this.coordinationsItems = new DefaultSelect(
        this.coordinationsTestData,
        5
      );
    } else {
      const id = parseInt(params.text);
      const item = [this.coordinationsTestData.filter((i: any) => i.id == id)];
      this.coordinationsItems = new DefaultSelect(item[0], 1);
    }
  }*/

  selectCoordination(event: any) {
    this.selectedCoordination = event;
  }

  exportExcel() {
    console.log('Universo ', this.form.get('check1').value);
    console.log('Eventos ', this.form.get('check2').value);
    this.pruebas();
  }

  private getWeekNumber(date: Date): number {
    const target = new Date(date.getTime());

    target.setDate(target.getDate() + 4 - (target.getDay() || 7));

    const yearStart = new Date(target.getFullYear(), 0, 1);
    const timeDiff = target.getTime() - yearStart.getTime();
    const dayOfYear = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    const weekNumber = Math.ceil(dayOfYear / 7);

    return weekNumber;
  }

  private formtDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${day}-${month}-${year}`;
  }

  pruebas() {
    //console.log('getWeekNumber ', this.getWeekNumber(new Date()));
    this.procesarFechas();
  }

  procesarFechas(): void {
    const rangeDate = this.form.get('rangeDate').value;
    if (rangeDate != null) {
      const inicio = secondFormatDate(rangeDate[0]);
      const final = secondFormatDate(rangeDate[1]);
      console.log('fechaI', inicio);
      console.log('fechaF', final);

      this.SEM1 = this.getWeekNumber(new Date(inicio));
      this.SEM2 = this.getWeekNumber(new Date(final));
      this.ANIO = new Date(inicio).getFullYear().toString();
      console.log('sem1 ', this.SEM1);
      console.log('sem2 ', this.SEM2);
      console.log('anio ', this.ANIO);

      if (final != null) {
        this.FEC3 = this.formtDate(new Date(final));
        console.log('fecha antes ', this.formatDate(new Date(this.FEC3)));
        this.getLastWeek(this.formatDate(new Date(final)));
      } else {
        this.FEC3 = 'NADA';
      }
      console.log('fecha 3 ', this.FEC3);
      //PARA EL UNIVERSO
      if (
        this.form.get('check1').value &&
        this.form.get('event').value == null &&
        this.form.get('check2').value == null
      ) {
        this.executeProcess(this.USEM, 1, this.form.get('event').value, 1);
      } else if (
        //-- PARA EL TODO
        this.form.get('check1').value &&
        this.form.get('check2').value &&
        this.form.get('event').value == null
      ) {
        this.executeProcess(this.USEM, 1, this.form.get('event').value, 2);
      } else if (
        //PARA UN EVENTO EN PARTICULAR
        this.form.get('check2').value &&
        this.form.get('event').value != null
      ) {
        this.executeProcess(this.USEM, 1, this.form.get('event').value, 3);
      } else if (
        //PARA TODOS LOS EVENTOS
        this.form.get('check2').value &&
        this.form.get('event').value == null &&
        this.form.get('check1').value == null
      ) {
        this.executeProcess(this.USEM, 1, this.form.get('event').value, 4);
      }
    }
  }

  getParametersMod(): number {
    let VALIDO: number = 0;
    let token = this.authService.decodeToken();
    let user = token.name.toUpperCase();
    const params = new FilterParams();
    let cadena = `?filter.parameter=$in:SUPUSUMUE,SUPUSUMUE,SUPUSUCOMER&filter.value=$eq:${user}`;
    this.parameterBrandsService.getSuperUser(cadena).subscribe(
      resp => {
        console.log('user -> ', resp);
        if (resp.count != null) {
          VALIDO = 1;
        } else {
          VALIDO = 0;
        }
      },
      err => {
        VALIDO = 0;
        console.log('error', err);
      }
    );
    return VALIDO;
  }

  executeProcess(
    PSEMRECAL: number,
    PRECAL: number,
    PEVENTO: number,
    PROCESO: number
  ) {
    let SEM2: number;
    let SEM1: number;
    let AUX: number;
    let SEMRECAL: number;
    let VALEJE: number = 0;
    const rangeDate = this.form.get('rangeDate').value;
    const inicio = secondFormatDate(rangeDate[0]);
    const final = secondFormatDate(rangeDate[1]);
    if (inicio != null) {
      SEM1 = this.getWeekNumber(new Date(inicio));
    } else {
      SEM1 = this.getWeekNumber(new Date());
    }

    if (final != null) {
      SEM2 = this.getWeekNumber(new Date(final));
    } else {
      SEM2 = this.getWeekNumber(new Date());
    }

    if (PRECAL == 0) {
      SEMRECAL = 0;
    } else {
      SEMRECAL = PSEMRECAL;
    }
    this.VALIDO = this.getParametersMod();
    console.log('valido ', this.VALIDO);

    if (this.VALIDO == 1) {
      if (PROCESO == 1) {
        let param = {
          psem1: SEM1,
          psem2: SEM2,
          pfec1: inicio,
          pfec2: final,
          psemrecal: SEMRECAL,
          pevent: 0,
        };
        this.postCentral(param);
      } else if (PROCESO == 2) {
        let param = {
          psem1: SEM1,
          psem2: SEM2,
          pfec1: inicio,
          pfec2: final,
          psemrecal: SEMRECAL,
          pevent: 0,
        };
        this.postCentral(param);
      } else if (PROCESO == 3) {
        this.postBienesEvento(PEVENTO);
      } else if (PROCESO == 4) {
      }
    }

    this.postBienesEvento(PEVENTO);

    //VALEJE = this.getLastWeek;
  }

  getLastWeek(date: string) {
    this.eventRelatedService.getLastWeek(date).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          this.USEM = resp.semana;
          console.log('resp fecha ', resp);
        }
      },
      err => {
        console.log('error', err);
      }
    );
  }

  postCentral(params: any) {
    this.eventRelatedService.postCentral(params).subscribe(resp => {
      if (resp != null && resp != undefined) {
        this.aux = resp.data;
      }
    });
  }

  postBienesEvento(id: number | string) {
    let params = {
      pEvent: id,
    };
    this.eventRelatedService.postBienesEvento(params).subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('resp', resp);
      }
    });
  }

  formatDate(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  Resumen(params: any) {
    this.eventAppService.postResumen(params).subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('Resp Resumen-> ', resp);
      }
    });
  }

  DetResumen(params: any) {
    this.eventAppService.postDetResumer(params).subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('Resp DetResumen=> ', resp);
      }
    });
  }

  DetRemesa(params: any) {
    this.eventAppService.postDetRemesa(params).subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('Resp DetRemesa-> ', resp);
      }
    });
  }

  DetEvent(params: any) {
    this.comerEventService.postDetEvento(params).subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('Resp DetEvent-> ', resp);
      }
    });
  }

  ResumenAdmvxr(params: any) {
    this.comerEventService.postResumenAdmvxr(params).subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('Resp ResumenAdmvxr', resp);
      }
    });
  }

  ResumenRemesa(params: any) {
    this.eventAppService.postResumenRemesa(params).subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('Resp ResumenReme-> ', resp);
      }
    });
  }
}

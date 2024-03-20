import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { FileSaverService } from 'src/app/common/services/file-saver.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { EventRelatedService } from 'src/app/core/services/ms-event-rel/event-rel.service';
import { EventAppService } from 'src/app/core/services/ms-event/event-app.service';
import { ParameterBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-brands.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { ComerLotService } from 'src/app/core/services/ms-prepareevent/comer-lot.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { firstFormatDate, secondFormatDate } from 'src/app/shared/utils/date';
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

  DELE: number;
  RECAL: number;
  USEM: number;

  VALIDO: number = 0;

  id_tpevento: number;
  descripcion: string;

  AUX: number;

  fechaInicio: Date;
  fechaFinal: Date;

  public coordination = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private parameterBrandsService: ParameterBrandsService,
    private authService: AuthService,
    private eventRelatedService: EventRelatedService,
    private eventAppService: EventAppService,
    private comerEventService: ComerEventService,
    private comerLotService: ComerLotService,
    private excelService: ExcelService,
    private fileSaverService: FileSaverService
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
      //rangeDate: [null, [maxDate(new Date())]],
      f_ini: [null, []],
      f_fin: [null, []],
      coordination: [null, []],
      opcion: [null, []],
      goods: [null, []],
      universe: [null],
      event: [null],
      idEvent: [null],
      typeEvent: [null],
    });
  }

  getParametersMod() {
    let token = this.authService.decodeToken();
    let user = token.preferred_username.toUpperCase();
    const params = new FilterParams();
    params.addFilter3('filter.valor', user);
    params.addFilter(
      'parameter',
      'SUPUSUMUE,SUPUSUINMU,SUPUSUCOMER',
      SearchFilter.IN
    );
    this.parameterBrandsService.getSuperUserv2(params.getParams()).subscribe({
      next: resp => {
        this.VALIDO = 1;
      },
      error: error => {
        this.VALIDO = 0;
      },
    });
  }

  ajustarFechas() {
    this.fechaInicio = this.form.controls['f_ini'].value;

    if (this.fechaInicio > new Date()) {
      this.alert(
        'warning',
        'Atención',
        'La fecha no puede ser mayor a la fecha de esta semana'
      );
      this.fechaInicio = null;
      this.form.controls['f_ini'].patchValue = null;
      this.fechaFinal = null;
      this.form.controls['f_fin'].patchValue = null;
      return;
    }

    if (this.form.controls['f_ini'].value == undefined) {
      return;
    }

    const fechaNuevaInicio = new Date(this.fechaInicio);
    const diaSemana = fechaNuevaInicio.getDay(); // 0 para domingo, 1 para lunes, etc.

    if (diaSemana !== 1) {
      // 1 representa lunes
      const diasFaltantes = 1 - diaSemana;
      fechaNuevaInicio.setDate(fechaNuevaInicio.getDate() + diasFaltantes);
    }

    const fechaFin = new Date(fechaNuevaInicio);
    fechaFin.setDate(fechaFin.getDate() + 6);

    this.fechaInicio = fechaNuevaInicio;
    this.fechaFinal = fechaFin;

    //Fechas formateadas
    const fechaNuevaInicioF = firstFormatDate(fechaNuevaInicio);
    const fechaFinF = firstFormatDate(fechaFin);

    this.ANIO = fechaNuevaInicio.getFullYear().toString();
  }

  selectCoordination(event: any) {
    this.selectedCoordination = event;
  }

  exportExcel() {
    this.SEM1 = this.getWeekNumber(this.form.controls['f_ini'].value);
    this.SEM2 = this.getWeekNumber(this.form.controls['f_fin'].value);
    this.FEC1 = this.form.controls['f_ini'].value;
    this.FEC2 = this.form.controls['f_fin'].value;
    this.FEC3 = secondFormatDate(this.form.controls['f_fin'].value);

    console.log('ANIO', this.ANIO);

    //USEM := COMER_DATAMART.ULTIMASEM(FEC3);
    this.eventRelatedService.getLastWeek(this.FEC3).subscribe({
      next: resp => {
        console.log('resp', resp);
        this.USEM = Number(resp.semana);

        this.doValidations();
      },
      error: error => {
        console.log('error', error);
      },
    });
  }

  doValidations() {
    console.log('Universo ', this.form.controls['universe'].value);
    console.log('Eventos ', this.form.controls['event'].value);

    const UNIVERSO = this.form.controls['universe'].value;
    const EVENTO = this.form.controls['event'].value;
    const idEvento = this.form.get('idEvent').value;

    //Fechas formateadas
    const psem1 = firstFormatDate(this.form.controls['f_ini'].value);
    const psem2 = firstFormatDate(this.form.controls['f_fin'].value);

    //IF NVL(:BLK_CTRL.UNIVERSO,'N') = 'S' AND :BLK_CTRL.IDEVENTO IS NULL AND NVL(:BLK_CTRL.EVENTOS,'N') = 'N' THEN
    // PARA EL UNIVERSO
    if (UNIVERSO && idEvento == null && !EVENTO) {
      console.log(
        'Opción 1 Se cumple -> universo true, id evento nulo, evento false'
      );
      this.executeProcess2(this.USEM, 1, idEvento, 1);
    }

    //ELSIF NVL(:BLK_CTRL.UNIVERSO,'N') = 'S' AND NVL(:BLK_CTRL.EVENTOS,'N') = 'S' AND :BLK_CTRL.IDEVENTO IS NULL THEN
    // PARA EL TODO
    if (UNIVERSO && EVENTO && idEvento == null) {
      console.log(
        'Opción 2 Se cumple -> universo true, evento true, id evento nulo'
      );
      this.executeProcess2(this.USEM, 1, idEvento, 2);
    }

    //ELSIF NVL(:BLK_CTRL.EVENTOS,'N') = 'S' AND :BLK_CTRL.IDEVENTO IS NOT NULL THEN
    // PARA UN EVENTO EN PARTICULAR
    if (EVENTO && idEvento !== null) {
      console.log(
        'Opción 3 Se cumple -> evento true, id evento diferente a nulo'
      );
      this.executeProcess2(this.USEM, 1, idEvento, 3);
    }

    //ELSIF NVL(:BLK_CTRL.EVENTOS,'N') = 'S' AND :BLK_CTRL.IDEVENTO IS NULL AND NVL(:BLK_CTRL.UNIVERSO,'N') = 'N' THEN
    // PARA TODOS LOS EVENTOS
    if (EVENTO && idEvento === null && !UNIVERSO) {
      console.log(
        'Opción 4 Se cumple -> evento true, id evento nulo, universo false'
      );
      this.executeProcess2(this.USEM, 1, idEvento, 4);
    }

    if (
      this.form.controls['coordination'].value == null ||
      this.form.controls['coordination'].value == '' ||
      this.form.controls['coordination'].value == undefined
    ) {
      this.DELE = -1;
      console.log('THIS.DELE', this.DELE);
    } else {
      this.DELE = this.form.controls['coordination'].value;
      console.log('THIS.DELE', this.DELE);
    }

    const opcion = this.form.controls['opcion'].value;
    console.log('opcion', opcion);

    switch (Number(opcion)) {
      case 1:
        let param1 = {
          psem1: psem1,
          psem2: psem2,
          pdele: Number(this.DELE),
        };
        this.Resumen(param1);

        break;

      case 2:
        let param2 = {
          psem1: psem1,
          psem2: psem2,
          pdele: Number(this.DELE),
          opcDatos: this.form.get('goods').value,
        };
        this.DetResumen(param2);

        break;

      case 3:
        let param3 = {
          fechaInicio: psem1,
          fechaFin: psem2,
          pSem1: psem1,
          pSem2: psem2,
          pDele: this.DELE,
          /*psem1: psem1,
          psem2: psem2,
          eventId: this.form.get('idEvent').value,
          panio: this.ANIO,
          pdele: this.DELE,*/
        };
        this.ResumenRemesa(param3);

        break;

      case 4:
        let param4 = {
          psem1: this.form.controls['f_ini'].value,
          psem2: this.form.controls['f_fin'].value,
          eventId: this.form.get('idEvent').value,
          panio: this.ANIO,
          pdele: this.DELE,
        };
        this.DetRemesa(param4);

        break;

      case 5:
        let param5 = {
          psem1: this.form.get('f_ini').value,
          psem2: psem2,
          dateFinal: this.FEC3,
          delegationNumber: this.form.get('coordination').value,
          typeEventId: this.form.get('typeEvent').value,
          eventId: this.form.get('idEvent').value,
        };

        this.ResumenEvento(param5);

        break;

      case 6: //No encontré registros
        let param6 = {
          psem1: psem1,
          psem2: psem2,
          pDele: this.DELE,
          ptevento: this.form.get('typeEvent').value,
          pidevento: this.form.get('idEvent').value,
          endDate: this.FEC3,
          //limit: 'Parametro de tipo numerico',
        };
        this.DetEvent(param6);

        break;

      case 7: //Excel sin registros
        let param7 = {
          psem1: psem1,
          psem2: psem2,
          pDele: this.DELE,
          endDate: this.FEC3,
        };
        this.ResumenAdmvxr(param7);

        break;

      default:
        break;
    }
  }

  executeProcess2(
    PSEMRECAL: number,
    PRECAL: number,
    PEVENTO: number,
    PROCESO: number
  ) {
    console.log('PSEMRECAL', PSEMRECAL);

    //let SEM1: number;
    // let SEM2: number;
    let AUX: number;
    let SEMRECAL: number;
    let VALEJE: number = 0;

    let inicio = firstFormatDate(this.form.controls['f_ini'].value);
    let final = firstFormatDate(this.form.controls['f_fin'].value);
    //SEM2 = this.getWeekNumber( this.form.controls['f_fin'].value);

    if (PRECAL == 0) {
      SEMRECAL = 0;
    } else {
      SEMRECAL = PSEMRECAL;
    }

    if (this.VALIDO == 1) {
      if (PROCESO == 1) {
        let param = {
          psem1: this.SEM1,
          psem2: this.SEM2,
          pfec1: inicio,
          pfec2: final,
          psemrecal: SEMRECAL,
          pevent: 0,
        };
        this.postCentral(param);
      } else if (PROCESO == 2) {
        let param = {
          psem1: this.SEM1,
          psem2: this.SEM2,
          pfec1: inicio,
          pfec2: final,
          psemrecal: SEMRECAL,
          pevent: 0,
        };
        this.postCentral(param);
        this.postSegBien(final);
      } else if (PROCESO == 3) {
        this.Eliminar(PEVENTO);
        this.postBienesEvento(PEVENTO);
      } else if (PROCESO == 4) {
        this.postSegBien(final);
      }
    }
    //this.postBienesEvento(PEVENTO);
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

  /*private formtDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${year}-${month}-${day}`;
  }*/

  /*procesarFechas(): void {
    let DELE: number;
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
      DELE = this.form.get('coordination').value;

      console.log(
        "this.form.get('opcion').value ",
        this.form.get('opcion').value
      );

      if (this.form.get('opcion').value == 1) {
        let param = {
          psem1: inicio,
          psem2: final,
          pdele: DELE,
        };
        this.Resumen(param);
      } else if (this.form.get('opcion').value == 2) {
        let param = {
          psem1: inicio,
          psem2: final,
          pdele: DELE,
          opcDatos: this.form.get('goods').value,
        };
        this.DetResumen(param);
      } else if (this.form.get('opcion').value == 3) {
        let param = {
          fechaInicio: inicio,
          fechaFin: final,
          pSem1: inicio,
          pSem2: final,
          pDele: DELE,
        };
        this.ResumenRemesa(param);
      } else if (this.form.get('opcion').value == 4) {
        let param = {
          psem1: inicio,
          psem2: final,
          eventId: this.form.get('event').value,
          panio: this.ANIO,
          pdele: DELE,
        };
        this.DetRemesa(param);
      } else if (this.form.get('opcion').value == 5) {
        let param = {
          psem1: inicio,
          psem2: final,
          dateFinal: this.FEC3,
          delegationNumber: this.form.get('coordination').value,
          typeEventId: this.id_tpevento,
          eventId: this.form.get('event').value,
        };
        console.log('paramResumen', param);
        this.ResumenEvento(param);
      } else if (this.form.get('opcion').value == 6) {
        let param = {
          psem1: inicio,
          psem2: final,
          pDele: DELE,
          ptevento: this.id_tpevento,
          pidevento: this.form.get('event').value,
          endDate: this.FEC3,
          //limit: 'Parametro de tipo numerico',
        };
        // let param2 = {
        //   endDate: '2023-08-16',
        //   pDele: '5',
        // };
        this.DetEvent(param);
      } else if (this.form.get('opcion').value == 7) {
        let param = {
          psem1: inicio,
          psem2: final,
          pDele: DELE,
          endDate: this.FEC3,
        };
        this.ResumenAdmvxr(param);
      }
    }
  }
*/

  /*executeProcess(
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
   // this.VALIDO = this.getParametersMod();
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
        //Por integrar Service SEGBIEN
      } else if (PROCESO == 3) {
        this.Eliminar(PEVENTO);
        this.postBienesEvento(PEVENTO);
      } else if (PROCESO == 4) {
        //por integrar Servicio SEGBIEN
      }
    }
    this.postBienesEvento(PEVENTO);
    //VALEJE = this.getLastWeek;
  }*/

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
    this.eventRelatedService.postCentral(params).subscribe({
      next: resp => {
        console.log('resp postCentral', resp);
        this.AUX = resp.data;
      },
      error: error => {
        console.log('error postCentral', error);
      },
    });
  }

  postSegBien(params: any) {
    this.eventRelatedService.postSegBien(params).subscribe({
      next: resp => {
        console.log('resp postSegBien', resp);
      },
      error: error => {
        console.log('error postSegBien', error);
      },
    });
  }

  Eliminar(id: number) {
    let body = {
      event: id,
    };

    this.eventRelatedService.delElimina(body).subscribe({
      next: resp => {
        console.log('Se ha eliminado', resp);
      },
      error: error => {
        console.log('No se ha eliminado', error);
      },
    });
  }

  postBienesEvento(id: number | string) {
    let params = {
      pEvent: id,
    };
    this.eventRelatedService.postBienesEvento(params).subscribe({
      next: resp => {
        console.log('respuesta postBienesEvento', resp);
      },
      error: error => {
        console.log('error postBienesEvento', error);
      },
    });
  }

  /*formatDate(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }*/

  Resumen(params: any) {
    this.eventAppService.postResumen(params).subscribe({
      next: resp => {
        this.convertBase64ToCsv(resp, 'Resumen');
      },
      error: error => {
        this.alert('error', 'Error', 'No se encontraron registros');
      },
    });
  }

  DetResumen(params: any) {
    this.eventAppService.postDetResumer(params).subscribe({
      next: resp => {
        this.convertBase64ToCsv(resp, 'Bienes del Resumen');
      },
      error: error => {
        this.alert('error', 'Error', 'No se encontraron registros');
      },
    });
  }

  DetRemesa(params: any) {
    this.eventAppService.postDetRemesa(params).subscribe({
      next: resp => {
        this.convertBase64ToCsv(resp, 'Bienes en Remesa');
      },
      error: error => {
        this.alert('error', 'Error', 'No se encontraron registros');
      },
    });
  }

  DetEvent(params: any) {
    this.comerEventService.postDetEvento(params).subscribe({
      next: resp => {
        this.convertBase64ToExcel(resp.base64, 'Bienes por Tipo de Evento');
      },
      error: error => {
        this.alert('error', 'Error', 'No se encontraron registros');
      },
    });
  }

  ResumenAdmvxr(params: any) {
    this.comerEventService.postResumenAdmvxr(params).subscribe({
      next: resp => {
        this.convertBase64ToExcel(resp.base64, 'Resumen ADM y VXR');
      },
      error: error => {
        this.alert('error', 'Error', 'No se encontraron registros');
      },
    });
  }

  ResumenRemesa(params: any) {
    this.eventAppService.postResumenRemesa(params).subscribe({
      next: resp => {
        this.convertBase64ToCsv(resp, 'Resumen Remesa');
      },
      error: error => {
        this.alert('error', 'Error', 'No se encontraron registros');
      },
    });
  }

  ResumenEvento(params: any) {
    this.comerLotService.PostResumenEven(params).subscribe({
      next: resp => {
        this.convertBase64ToExcel(resp.base64, 'Resumen por Tipo de Evento');
      },
      error: error => {
        this.alert('error', 'Error', 'No se encontraron registros');
      },
    });
  }

  convertBase64ToCsv(base64Data: string, filename: string) {
    // Decodificar el base64 para obtener el contenido CSV
    const csvContent = atob(base64Data);

    // Crear un Blob a partir del contenido CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });

    if ((window as any).navigator.msSaveOrOpenBlob) {
      // Para Internet Explorer
      (window as any).navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      // Para navegadores modernos
      const csvUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = csvUrl;
      link.target = '_blank';
      link.download = filename;
      link.click();
      link.remove();
      this.alert('success', 'Archivo Descargado Correctamente', '');
    }
  }

  event() {
    let id = this.form.get('event').value;
    if (id != null) {
      this.eventAppService.getEvent(id).subscribe(resp => {
        if (resp != null && resp != undefined) {
          this.id_tpevento = Number(resp.data[0].id_tpevento);
          this.descripcion = resp.data[0].descripcion;
          console.log('Resp Event', resp);
          console.log('Id tipoEvent', this.id_tpevento);
          console.log('Description', this.descripcion);
        }
      });
    }
  }

  convertBase64ToExcel(base64Data: string, filename: string) {
    const binaryString = atob(base64Data);
    const byteArray = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    if ((window.navigator as any).msSaveOrOpenBlob) {
      (window.navigator as any).msSaveOrOpenBlob(blob, filename);
    } else {
      const excelUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = excelUrl;
      link.target = '_blank';
      link.download = filename;
      link.click();
      link.remove();
      this.alert('success', 'Archivo Descargado Correctamente', '');
    }
  }
}

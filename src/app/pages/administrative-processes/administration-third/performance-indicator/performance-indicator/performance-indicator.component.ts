import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { StrategyServiceService } from 'src/app/core/services/ms-strategy/strategy-service.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { PerformanceIndicatorStrategyComponent } from '../performance-indicator-strategy/performance-indicator-strategy.component';
import {
  PERFORMANCEINDICATOR_COLUMNS,
  REPORTPERFORMANCEINDICATOR_COLUMNS,
} from './performance-indicator-columns';

@Component({
  selector: 'app-performance-indicator',
  templateUrl: './performance-indicator.component.html',
  styles: [],
})
export class PerformanceIndicatorComponent extends BasePage implements OnInit {
  performanceIndicatorForm: FormGroup;
  performanceIndicatorFormE_I: FormGroup;
  settings2 = {
    ...this.settings,
    hideSubHeader: false,
    actions: false,
    columns: REPORTPERFORMANCEINDICATOR_COLUMNS,
  };
  data1: any[] = [];
  data2: any[] = [];
  paramsA = new BehaviorSubject<ListParams>(new ListParams());
  paramsI = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  filterParams2 = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItemsA: number = 0;
  totalItemsI: number = 0;
  compliance: Number = 0;
  status: number = 0;
  enabled: boolean = true;
  maxDate: Date;
  minDate: Date;
  month: string = 'MES';
  flagSearch: boolean = false;
  loadingText: string = 'Reporte';
  lv_existe: number = 0;
  data: LocalDataSource = new LocalDataSource();
  dataF: LocalDataSource = new LocalDataSource();
  showResolucion: boolean = false;
  T_FOL_REG: number = 0;
  T_FOL_ENT: number = 0;
  T_REP_REG: number = 0;
  T_REP_ENT: number = 0;

  public regionalCoordination = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private strategyServiceService: StrategyServiceService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: PERFORMANCEINDICATOR_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.prepareFormR_I();
  }
  private prepareForm() {
    this.performanceIndicatorForm = this.fb.group({
      dateCapture: [null],
      year: [null, Validators.required],
      month: [null, Validators.required],
      regionalCoordination: [null, Validators.required],
      user: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
    });
  }

  private prepareFormR_I() {
    this.performanceIndicatorFormE_I = this.fb.group({
      strategyAdmin: [null, Validators.required],
      strategyAdmin2: [null, Validators.required],
      reportImp: [null, Validators.required],
      reportImp2: [null, Validators.required],
    });
  }

  openStrategy(data: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(PerformanceIndicatorStrategyComponent, config);
  }

  validateEAE(event: any) {
    //console.log('event ', event);
    const strategyAdmin = this.performanceIndicatorFormE_I.get('strategyAdmin');
    if (strategyAdmin.value == undefined) {
      this.alert(
        'warning',
        'Validar',
        'El número de folios de estrategias de administración que se debierón entregar no puede ser nulo.'
      );
    } else if (Number(strategyAdmin.value) < 0) {
      this.alert(
        'warning',
        'Validar',
        'El número de folios de estrategias de administración que se debierón entregar no debe ser menor de cero'
      );
    }

    this.calculateProgressPercentage();
  }

  validateRI(event: any) {
    const reportImp = this.performanceIndicatorFormE_I.get('reportImp');
    //console.log(ReportImp.value);

    if (reportImp.value == undefined) {
      this.alert(
        'warning',
        'Validar',
        'El número de reportes de implementación que se debierón entregar no puede ser nulo.'
      );
    } else if (Number(reportImp.value) < 0) {
      this.alert(
        'warning',
        'Validar',
        'El número de reportes de implementación que se debierón entregar no es un valor valido'
      );
    }
    this.calculateProgressPercentage();
  }

  validateEAE2(event: any) {
    const stategyAdminI = this.performanceIndicatorFormE_I.get('strategyAdmin');
    const stategyAdmin = this.performanceIndicatorFormE_I.get('strategyAdmin2');
    //console.log(stategyAdmin.value);

    if (stategyAdmin.value == undefined) {
      //ReportImp.value = '0';
    } else if (Number(stategyAdmin.value) >= 0) {
      if (Number(stategyAdmin.value) > Number(stategyAdminI.value)) {
        this.alert(
          'warning',
          'Validar',
          'El número de folios de estrategias de administración que se entregarón a tiempo no debe ser mayor que el número de est. que se debierón entregar'
        );
      }
    } else {
      this.alert(
        'warning',
        'Validar',
        'El número de folios de estrategias de administración que se entregarón a tiempo no es un valor valido ...'
      );
    }
    this.calculateProgressPercentage();
  }

  validateRI2(event: any) {
    const reportImpI = this.performanceIndicatorFormE_I.get('reportImp');
    const reportImp = this.performanceIndicatorFormE_I.get('reportImp2');
    //console.log(ReportImp.value);
    let indicador = false;

    if (reportImp.value == undefined) {
      indicador = true;
      this.alert(
        'warning',
        'Validar',
        'El número de reportes de implementación que se debierón entregar no es un valor valido'
      );
    } else if (Number(reportImp.value) >= 0) {
      if (Number(reportImp.value) > Number(reportImpI.value)) {
        indicador = true;
        this.alert(
          'warning',
          'Validar',
          'El número de folios de estrategias de administración que se entregarón a tiempo no debe ser mayor que el número de est. que se debierón entregar'
        );
      }
    }
    if (!indicador) {
      this.calculateProgressPercentage();
    }
  }

  validateYear() {
    const year = this.performanceIndicatorForm.get('year');
    const isValidYear = /^\d{4}$/.test(year.value);

    let lv_anio_proc: number;
    const currentDate = new Date();
    lv_anio_proc = currentDate.getFullYear();
    if (year.value != undefined && year.value != null) {
      if (isValidYear) {
        if (year.value >= 2006 && year.value <= 2050) {
          console.log('pertenece');
          if (year.value >= 2006 && year.value <= lv_anio_proc) {
            this.performanceIndicatorForm.patchValue({
              dateCapture: new Date(),
            });
            //this.status = 'ABIERTO';
            this.status = 1;
          } else {
            //this.status = 'CERRADO';
            this.status = 0;
            this.alert('error', 'El año no puede ser mayor al vigente', '');
          }
        } else {
          this.status = 0;
          this.alert('error', 'Valor no es valido para el año', '');
        }
      }
    }
  }

  validateMonth() {
    const numberMonth = this.performanceIndicatorForm.get('month');
    const year = this.performanceIndicatorForm.get('year');
    //console.log(numberMonth.value);
    if (Number(numberMonth.value) >= 0 && Number(numberMonth.value) <= 12) {
      switch (Number(numberMonth.value)) {
        case 1:
          this.month = 'ENERO';
          break;
        case 2:
          this.month = 'FEBRERO';
          break;
        case 3:
          this.month = 'MARZO';
          break;
        case 4:
          this.month = 'ABRIL';
          break;
        case 5:
          this.month = 'MAYO';
          break;
        case 6:
          this.month = 'JUNIO';
          break;
        case 7:
          this.month = 'JULIO';
          break;
        case 8:
          this.month = 'AGOSTO';
          break;
        case 9:
          this.month = 'SEPTIEMBRE';
          break;
        case 10:
          this.month = 'OCTUBRE';
          break;
        case 11:
          this.month = 'NOVIEMBRE';
          break;
        case 12:
          this.month = 'DICIEMBRE';
          break;
        default:
          this.month = 'MES';
      }

      const currentDate = new Date();
      //valida
      let lv_mes_proc: Number;
      let lv_ani_proc: Number;
      let lv_ani_ante: Number;
      // Obtener el mes actual como número (ejemplo: 7 para julio)
      lv_mes_proc = currentDate.getMonth() + 1;
      // Obtener el año actual como número (ejemplo: 2023)
      lv_ani_proc = currentDate.getFullYear();
      // Obtener el año anterior como número (ejemplo: 2022)
      lv_ani_ante = Number(lv_ani_proc) - 1;

      if (Number(year.value) == lv_ani_proc) {
        if (
          Number(numberMonth.value) >= 0 &&
          Number(numberMonth.value) <= Number(lv_mes_proc)
        ) {
          null;
        } else {
          this.alert('error', 'El mes no puede ser mayor al vigente', '');
        }
      } else {
        if (Number(year.value) == Number(lv_ani_ante)) {
          if (Number(numberMonth.value) != 12) {
            this.alert(
              'error',
              'No puede registrar Estrategias de Administración para meses anteriores a Diciembre del año pasado',
              ''
            );
          } else {
            this.alert('error', 'El año no puede ser menor al anterior', '');
          }
        }
      }
    } else {
      this.alert('error', 'Mes no válido', '');
    }
  }

  cleanData() {
    this.performanceIndicatorForm.reset();
    this.performanceIndicatorFormE_I.reset();
    this.compliance = 0;
    this.data1 = [];
    this.data.load(this.data1);
    this.data2 = [];
    this.totalItemsA = 0;
    this.totalItemsI = 0;
    this.dataF.load(this.data2);
    this.enabled = true;
  }

  search() {
    let param = {
      yearEvaluateId: this.performanceIndicatorForm.get('year').value,
      monthEvaluateId: this.performanceIndicatorForm.get('month').value,
      delegationNumberId: this.performanceIndicatorForm.get(
        'regionalCoordination'
      ).value,
      userInsertId: this.performanceIndicatorForm.get('user').value,
    };

    /*let param2 = {
      yearEvaluateId: '2008',
      monthEvaluateId: 1,
      delegationNumberId: 6,
      userInsertId: 'ROGARCIA',
    };*/
    //console.log(this.performanceIndicatorForm);
    //console.log('param-> ', param);
    this.strategyServiceService.getStrategiesAdmin(param).subscribe({
      next: res => {
        console.log('data rec ', res);
        console.log(res.extraDevAmongNumber);
        this.lv_existe = 1;
        this.getFolioDeliveredWeather();
        if (res.statusEadmi == '0') {
          //this.status = 'ABIERTO';
          this.status = 0;
          this.enabled = false;
        } else {
          this.status = 1;
          this.enabled = true;
        }
        this.performanceIndicatorFormE_I.patchValue({
          strategyAdmin: res.extraDevAmongNumber,
          strategyAdmin2: res.straAWeatherNumber,
          reportImp: res.reportDevAmongNumber,
          reportImp2: res.reportAWeatherNumber,
        });
        this.calculateProgressPercentage();
      },
      error: err => {
        this.alert('error', 'Error al consultar registros', '');
      },
    });
  }

  calculateProgressPercentage() {
    const strategyAdmin = this.performanceIndicatorFormE_I.get('strategyAdmin');
    const strategyAdmin2 =
      this.performanceIndicatorFormE_I.get('strategyAdmin2');
    const reportImp = this.performanceIndicatorFormE_I.get('reportImp');
    const reportImp2 = this.performanceIndicatorFormE_I.get('reportImp2');
    if (
      strategyAdmin.value != undefined &&
      strategyAdmin2.value != undefined &&
      reportImp.value != undefined &&
      reportImp2.value != undefined
    ) {
      //debugger;
      if (strategyAdmin2.value === 0 || strategyAdmin2.value === null) {
        if (Number(strategyAdmin.value) + Number(reportImp.value) === 0) {
          this.compliance = 100;
        } else {
          const lv_denomi =
            Number(strategyAdmin2.value) + Number(reportImp2.value);
          const lv_numera =
            Number(strategyAdmin.value) + Number(reportImp.value);

          if (lv_denomi === 0) {
            this.compliance = 0;
          } else {
            if (lv_numera === 0) {
              this.compliance = 100;
            } else {
              this.compliance = this.roundPercentage(
                (lv_denomi / lv_numera) * 100
              );
              //this.compliance = (lv_denomi / lv_numera) * 100;
            }
          }
        }
      } else {
        const lv_denomi =
          Number(strategyAdmin2.value) + Number(reportImp2.value);
        const lv_numera = Number(strategyAdmin.value) + Number(reportImp.value);
        if (lv_denomi === 0) {
          this.compliance = 0;
        } else {
          if (lv_numera === 0) {
            this.compliance = 100;
          } else {
            //this.compliance = (lv_denomi / lv_numera) * 100;
            this.compliance = this.roundPercentage(
              (lv_denomi / lv_numera) * 100
            );
          }
        }
      }
    }
  }

  roundPercentage(percentage: number): number {
    return parseFloat(percentage.toFixed(1));
  }

  enabledSearch() {
    if (
      this.performanceIndicatorForm.get('year').value &&
      this.performanceIndicatorForm.get('month').value &&
      this.performanceIndicatorForm.get('regionalCoordination').value &&
      this.performanceIndicatorForm.get('user').value
    ) {
      this.flagSearch = true;
    } else {
      this.flagSearch = false;
    }
  }

  downloadReport() {
    //this.loading = true;
    if (this.lv_existe == 1) {
      if (this.status == 0) {
        this.loadingText = 'Generando..';
        let params = {
          P_ANIO: this.performanceIndicatorForm.get('year').value,
          P_MES: this.performanceIndicatorForm.get('month').value,
          P_COORDINACION: this.performanceIndicatorForm.get(
            'regionalCoordination'
          ).value,
        };

        this.siabService.fetchReport('RINDICA_0007', params).subscribe({
          next: (response: BlobPart) => {
            this.loadingText = 'Reporte';
            this.loading = false;
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              }, //pasar datos por aca
              class: 'modal-lg modal-dialog-centered',
              ignoreBackdropClick: true,
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          },
        });
      } else {
        this.alert(
          'error',
          'La Estrategia de administración no esta cerrada ...',
          ''
        );
      }
    } else {
      this.alert(
        'error',
        'El registro no esta guardado, verifique sus datos ...',
        ''
      );
    }
  }

  getFolioDeliveredWeather() {
    let yearEvaluateId = this.performanceIndicatorForm.get('year').value;
    let monthEvaluateId = this.performanceIndicatorForm.get('month').value;
    let delegationNumberId = this.performanceIndicatorForm.get(
      'regionalCoordination'
    ).value;

    //console.log(this.performanceIndicatorForm);
    //console.log('param-> ', param);
    this.strategyServiceService
      .getfolioDeliveredWeather(
        yearEvaluateId,
        monthEvaluateId,
        delegationNumberId
      )
      .subscribe({
        next: res => {
          console.log('res ', res.data);
          let con = 0;
          let con2 = 0;
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i] != undefined) {
              if (res.data[i].folioAmongWeatherId != null) {
                let item: any = {
                  consecutive: res.data[i].consecutiveId,
                  strategy: res.data[i].folioAmongWeatherId,
                  deliveredTime: res.data[i].valFolioAmongTime,
                };
                this.data1.push(item);
                con++;
              }
              if (res.data[i].repAmongWeather != null) {
                let item: any = {
                  consecutive: res.data[i].consecutiveId,
                  report: res.data[i].repAmongWeather,
                  deliveredTime: res.data[i].valRepAmongTime,
                };
                this.data2.push(item);
                con2++;
              }
            }
          }
          this.data.load(this.data1);
          this.dataF.load(this.data2);
          this.totalItemsA = con;
          this.totalItemsI = con2;
          console.log('folios entregados a tiempo', res.count);
        },
        error: err => {
          this.alert(
            'error',
            'Error al consultar folios entregados a tiempo',
            ''
          );
        },
      });
  }

  reportAndTables() {
    this.validIndication();
    if (this.showResolucion) {
      this.showResolucion = false;
    } else {
      this.showResolucion = true;
    }
  }

  validIndication() {
    let params = {
      evaluateYear: this.performanceIndicatorForm.get('year').value,
      evaluateMonth: this.performanceIndicatorForm.get('month').value,
      delegationNumber: this.performanceIndicatorForm.get(
        'regionalCoordination'
      ).value,
    };
    this.strategyServiceService.pupValidaIndica(params).subscribe({
      next: res => {
        console.log('res ', res.count);
        this.T_FOL_REG = res.count;
        this.validIndicationRep();
      },
      error: err => {
        console.log('err', err);
      },
    });
  }
  validIndicationRep() {
    let params = {
      evaluateYear: this.performanceIndicatorForm.get('year').value,
      evaluateMonth: this.performanceIndicatorForm.get('month').value,
      delegationNumber: this.performanceIndicatorForm.get(
        'regionalCoordination'
      ).value,
    };
    this.strategyServiceService.pupValidaIndicaRep(params).subscribe({
      next: res => {
        console.log('res ', res.count);
        this.T_FOL_ENT = res.count;
        this.validIndicationTime();
      },
      error: err => {
        console.log('err', err);
      },
    });
  }
  validIndicationTime() {
    let params = {
      evaluateYear: this.performanceIndicatorForm.get('year').value,
      evaluateMonth: this.performanceIndicatorForm.get('month').value,
      delegationNumber: this.performanceIndicatorForm.get(
        'regionalCoordination'
      ).value,
    };
    this.strategyServiceService.pupValidaIndicaTime(params).subscribe({
      next: res => {
        console.log('res ', res.count);
        this.T_REP_REG = res.count;
        this.validIndicationVal();
      },
      error: err => {
        console.log('err', err);
      },
    });
  }
  validIndicationVal() {
    let params = {
      evaluateYear: this.performanceIndicatorForm.get('year').value,
      evaluateMonth: this.performanceIndicatorForm.get('month').value,
      delegationNumber: this.performanceIndicatorForm.get(
        'regionalCoordination'
      ).value,
    };
    this.strategyServiceService.pupValidaIndicaVal(params).subscribe({
      next: res => {
        console.log('res ', res.count);
        this.T_REP_ENT = Number(res.count);
      },
      error: err => {
        console.log('err', err);
      },
    });
  }

  closeStrategy() {
    if (this.status == 0) {
      this.alert(
        'error',
        'La Estrategia de administración ya fue cerrada ...',
        ''
      );
    } else {
      console.log(
        this.T_FOL_ENT,
        '- ',
        this.T_FOL_REG,
        '-',
        this.T_REP_ENT,
        '-',
        this.T_REP_REG
      );
      let lv_fol_reg: Number;
      let lv_fol_ent: Number;
      let lv_rep_reg: Number;
      let lv_rep_ent: Number;

      let lv_val_rep: string = '0';
      let lv_val_fol: string = '0';

      lv_fol_reg = this.T_FOL_REG;
      lv_fol_ent = this.T_FOL_ENT;
      lv_rep_reg = this.T_REP_REG;
      lv_rep_ent = this.T_REP_ENT;
      if (
        this.performanceIndicatorFormE_I.get('strategyAdmin').value !=
          undefined &&
        this.performanceIndicatorFormE_I.get('reportImp').value != undefined &&
        this.performanceIndicatorFormE_I.get('strategyAdmin2').value !=
          undefined &&
        this.performanceIndicatorFormE_I.get('reportImp2').value != undefined
      ) {
        //debugger;
        if (
          Number(
            this.performanceIndicatorFormE_I.get('strategyAdmin').value
          ) === (lv_fol_reg || 0)
        ) {
          if (
            Number(
              this.performanceIndicatorFormE_I.get('strategyAdmin2').value
            ) === (lv_fol_ent || 0)
          ) {
            lv_val_fol = '1';
          } else {
            this.alert(
              'error',
              'No se puede cerrar el registro, el número de folios que se debierón de entregar no es correcto ...',
              ''
            );
          }
        } else {
          this.alert(
            'error',
            'No se puede cerrar el registro, el número de folios registrados no es el adecuado, verifique sus datos ...',
            ''
          );
        }

        if (
          Number(this.performanceIndicatorFormE_I.get('reportImp').value) ===
          (lv_rep_reg || 0)
        ) {
          if (
            Number(this.performanceIndicatorFormE_I.get('reportImp2').value) ===
            (lv_rep_ent || 0)
          ) {
            lv_val_rep = '1';
          } else {
            this.alert(
              'error',
              'No se puede cerrar el registro, el número de reportes que se debierón de entregar no es correcto ...',
              ''
            );
          }
        } else {
          this.alert(
            'error',
            'No se puede cerrar el registro, el número de reportes registrados no es el adecuado, verifique sus datos ...',
            ''
          );
        }

        if (lv_val_rep + lv_val_fol == '11') {
          if (this.status == 0) {
            this.alert(
              'error',
              'La Estrategia de administración ya fue cerrada ...',
              ''
            );
          } else {
            this.status = 0;
            this.performanceIndicatorForm.patchValue({
              dateCapture: new Date(),
            });
            this.alert(
              'success',
              'Estrategia de administración cerrada ...',
              ''
            );
          }
        } else {
          this.alert(
            'error',
            'Esta Estrategia de administración no fue cerrada',
            ''
          );
        }
      }
    }
  }
}

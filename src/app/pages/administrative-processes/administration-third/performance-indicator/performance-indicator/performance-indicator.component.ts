import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { StrategyServiceTypeService } from 'src/app/core/services/ms-strategy/strategy-service-type.service';
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
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsA: number = 0;
  totalItemsI: number = 0;
  compliance: Number = 0;
  status: string = 'CERRADO';

  public regionalCoordination = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private strategyServiceTypeService: StrategyServiceTypeService,
    private strategyServiceService: StrategyServiceService
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
      dateCapture: [null, Validators.required],
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
  public getRegionalCoordination(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.peritos = new DefaultSelect(data.data, data.count);
    // });
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
    console.log('event ', event);
    //const stategyAdmin = this.performanceIndicatorFormE_I.get('stategyAdmin');
    /*const stategyAdmin = document.getElementById(
      'stategyAdmin'
    ) as HTMLInputElement;*/

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

    if (reportImp.value == undefined || reportImp.value == '') {
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

    if (stategyAdmin.value == undefined || stategyAdmin.value == '') {
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

    if (reportImp.value == undefined || reportImp.value == '') {
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

  search() {
    let param = {
      yearEvaluateId: '2008',
      monthEvaluateId: '1',
      delegationNumberId: '6',
      userInsertId: 'ROGARCIA',
    };

    this.strategyServiceService.getStrategiesAdmin(param).subscribe({
      next: res => {
        console.log('data rec ', res);
        console.log(res.extraDevAmongNumber);
        if (res.statusEadmi != '0') {
          this.status = 'ABIERTO';
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
      debugger;
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
              this.compliance = (lv_denomi / lv_numera) * 100;
            }
          }
        }
      } else {
        const lv_denomi =
          Number(strategyAdmin2.value) + Number(reportImp2.value);
        const lv_numera = Number(strategyAdmin.value) + Number(reportImp.value);
        console.log(lv_numera);
        console.log(lv_denomi);
        if (lv_denomi === 0) {
          this.compliance = 0;
        } else {
          if (lv_numera === 0) {
            this.compliance = 100;
          } else {
            this.compliance = (lv_denomi / lv_numera) * 100;
          }
        }
      }
    }
  }
}

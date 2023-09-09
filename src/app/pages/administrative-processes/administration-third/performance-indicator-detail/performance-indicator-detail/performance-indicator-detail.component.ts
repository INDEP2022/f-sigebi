import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { StrategyProcessService } from 'src/app/core/services/ms-strategy/strategy-process.service';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { BasePage } from 'src/app/core/shared';
import {
  PERFORMANCEINDICATOR_COLUMNS,
  REPORTPERFORMANCEINDICATOR_COLUMNS,
} from './performance-indicator-columns';

@Component({
  selector: 'app-performance-indicator-detail',
  templateUrl: './performance-indicator-detail.component.html',
  styles: [],
})
export class PerformanceIndicatorDetailComponent
  extends BasePage
  implements OnInit
{
  data1: any[] = [];
  data2: any[] = [];
  data: LocalDataSource = new LocalDataSource();
  dataF: LocalDataSource = new LocalDataSource();
  paramsA = new BehaviorSubject<ListParams>(new ListParams());
  paramsI = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsA: number = 0;
  totalItemsI: number = 0;
  Form: FormGroup;
  FormE_I: FormGroup;
  enabled: boolean = true;
  compliance: Number = 0;
  month: string = 'MES';
  status: number = 0;
  user1: any;
  bsValueFromYear: Date = new Date();
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  columnFilters: any = [];
  selectedRow: any;

  settings2 = {
    ...this.settings,
    hideSubHeader: false,
    actions: false,
    columns: REPORTPERFORMANCEINDICATOR_COLUMNS,
  };

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private strategyProcessService: StrategyProcessService,
    private goodPosessionThirdpartyService: GoodPosessionThirdpartyService
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
    this.filterA();
    this.bsConfigFromYear = {
      dateInputFormat: 'YYYY',
      showTodayButton: false,
      isAnimated: true,
      maxDate: new Date(),
      minMode: 'year',
    };
  }

  close() {
    this.modalRef.hide();
  }

  private prepareForm() {
    this.Form = this.fb.group({
      dateCapture: [null],
      year: [null, Validators.required],
      month: [null, Validators.required],
      regionalCoordination: [null, Validators.required],
      user: [null, Validators.required],
    });
  }

  private prepareFormR_I() {
    this.FormE_I = this.fb.group({
      strategyAdmin: [null, Validators.required],
      strategyAdmin2: [null, Validators.required],
      reportImp: [null, Validators.required],
      reportImp2: [null, Validators.required],
    });
  }

  validateRI(event: any) {
    const strategyAdmin =
      this.FormE_I.get('strategyAdmin').value != null
        ? this.FormE_I.get('strategyAdmin').value
        : 0;
    const strategyAdmin2 =
      this.FormE_I.get('strategyAdmin2').value != null
        ? this.FormE_I.get('strategyAdmin2').value
        : 0;
    const reportImp =
      this.FormE_I.get('reportImp').value != null
        ? this.FormE_I.get('reportImp').value
        : 0;
    const reportImp2 =
      this.FormE_I.get('reportImp2').value != null
        ? this.FormE_I.get('reportImp2').value
        : 0;
    console.log('strategyAdmin ', strategyAdmin);
    console.log('strategyAdmin2 ', strategyAdmin2);
    console.log('reportImp ', reportImp);
    console.log('reportImp2 ', reportImp2);
    let lv_denomi = strategyAdmin2 + strategyAdmin;
    let lv_numera = reportImp + reportImp2;

    if (lv_denomi == 0) {
      this.compliance = this.roundPercentage(0);
    } else if (lv_numera == 0) {
      this.compliance = this.roundPercentage(100);
    } else {
      this.compliance = this.roundPercentage((lv_denomi / lv_numera) * 100);
    }
  }

  roundPercentage(percentage: number): number {
    return parseFloat(percentage.toFixed(1));
  }

  validateMonth() {
    const numberMonth = this.Form.get('month');
    const year = this.Form.get('year');
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

  validateYear() {
    const year = this.Form.get('year');
    const isValidYear = /^\d{4}$/.test(year.value);

    let lv_anio_proc: number;
    const currentDate = new Date();
    lv_anio_proc = currentDate.getFullYear();
    if (year.value != undefined && year.value != null) {
      if (isValidYear) {
        if (year.value >= 2006 && year.value <= 2050) {
          console.log('pertenece');
          if (year.value >= 2006 && year.value <= lv_anio_proc) {
            this.Form.patchValue({
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

  search() {
    let Month = this.Form.get('month').value;
    console.log('Mes ', Month);
    let year = this.Form.get('year').value;
    console.log('Año ', year);
    let Delegation = this.Form.get('regionalCoordination').value;
    console.log('Delegacion ', Delegation);
    var fechaCompleta = new Date(year);
    var year1 = fechaCompleta.getFullYear();
    this.getTable1(Month, year1, Delegation);
    window.scrollTo(0, 0);
  }
  searchA() {
    let Month = this.Form.get('month').value;
    console.log('Mes ', Month);
    let year = this.Form.get('year').value;
    console.log('Año ', year);
    let Delegation = this.Form.get('regionalCoordination').value;
    console.log('Delegacion ', Delegation);
    var fechaCompleta = new Date(year);
    var year1 = fechaCompleta.getFullYear();
    if (Month != null) {
      this.getTable1(Month, year1, Delegation);
    }
  }

  searchR() {
    let Month = this.Form.get('month').value;
    console.log('Mes ', Month);
    let year = this.Form.get('year').value;
    console.log('Año ', year);
    let Delegation = this.Form.get('regionalCoordination').value;
    console.log('Delegacion ', Delegation);
    var fechaCompleta = new Date(year);
    var year1 = fechaCompleta.getFullYear();
    if (Month != null) {
      this.getTable2(Month, year1, Delegation);
    }
  }

  getTable1(Month: number, Year: number, delegation: number) {
    this.totEstInTime(Month, Year, delegation);
    let params = {
      ...this.paramsA.getValue(),
      ...this.columnFilters,
    };
    this.data1 = [];
    this.data.load(this.data1);
    this.strategyProcessService
      .getByMonthYear(Month, Year, delegation, params)
      .subscribe({
        next: resp => {
          let TOT_EST_EN_TIEMPO = 0;
          console.log('respues primera tabla ', resp);
          for (let i = 0; i < resp.data.length; i++) {
            let params = {
              strategy: resp.data[i].formatKey,
              deliveredTime: resp.data[i].estTime,
              noFormat: resp.data[i].formatNumber,
            };
            this.data1.push(params);
            this.data.load(this.data1);
            this.totalItemsA = resp.count;
            this.FormE_I.patchValue({
              strategyAdmin: resp.count,
            });
            console.log('total : > ', TOT_EST_EN_TIEMPO);
          }
        },
      });
  }

  getTable2(Month: number, Year: number, delegation: number) {
    this.totRepInTime(Month, Year, delegation);
    let params = {
      ...this.paramsA.getValue(),
      ...this.columnFilters,
    };
    this.data2 = [];
    this.dataF.load(this.data1);
    this.goodPosessionThirdpartyService
      .getByMonthYearIndicator(Month, Year, delegation, params)
      .subscribe({
        next: resp => {
          console.log('respues primera tabla ', resp);
          for (let i = 0; i < resp.data.length; i++) {
            let params = {
              report: resp.data[i].reportKey,
              deliveredTime: resp.data[i].thisTime,
              reportNumber: resp.data[i].formatNumber,
            };
            this.data2.push(params);
            this.dataF.load(this.data1);
            this.totalItemsA = resp.count;
            this.FormE_I.patchValue({
              reportImp: resp.count,
            });
          }
        },
      });
  }

  totEstInTime(Month: number, Year: number, delegation: number) {
    this.strategyProcessService
      .getByMonthYearTotal(Month, Year, delegation)
      .subscribe({
        next: response => {
          this.FormE_I.patchValue({
            strategyAdmin2: response.count,
          });
        },
      });
  }

  totRepInTime(Month: number, Year: number, delegation: number) {
    this.goodPosessionThirdpartyService
      .getByMonthYearIndicatorNumber(Month, Year, delegation)
      .subscribe({
        next: response => {
          this.FormE_I.patchValue({
            reportImp2: response.count,
          });
        },
      });
  }

  filterA() {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'strategy':
                field = 'filter.formatKey';
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsA = this.pageFilter(this.paramsA);
          this.searchR();
        }
      });
    this.paramsA
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchR());
  }

  filterR() {
    this.dataF
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'report':
                field = 'filter.reportKey';
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsI = this.pageFilter(this.paramsI);
          this.searchA();
        }
      });
    this.paramsI
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchA());
  }

  report() {
    this.alert('warning', 'Alerta', 'El Reporte no se Encuentra Disponible');
  }

  delete() {
    this.alertQuestion(
      'warning',
      'Seguro de Eliminar la Estrategia de Administración ' +
        this.selectedRow.noFormat +
        ' ?',
      '',
      'Aceptar',
      'Cancelar'
    ).then(question => {
      if (question.isConfirmed) {
        let params = {
          numpro: 8,
          format: this.selectedRow.noFormat,
        };
        this.strategyProcessService.ByFormatNumber(params).subscribe({
          next: response => {
            this.alert(
              'success',
              'Eliminado Correctamente',
              'La Estrategia de Administración Fue Eliminada Correctamente'
            );
            this.searchA();
            this.selectedRow = null;
            window.scrollTo(0, 80);
          },
        });
      }
    });
  }

  onRowSelect(event: any) {
    this.selectedRow = event.data;
    console.log('this.selectedRow ', this.selectedRow);
  }
}

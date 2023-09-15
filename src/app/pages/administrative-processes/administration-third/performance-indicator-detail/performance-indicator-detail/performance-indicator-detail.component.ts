import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { StrategyProcessService } from 'src/app/core/services/ms-strategy/strategy-process.service';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { IndUserService } from 'src/app/core/services/ms-users/ind-user.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { PerformanceIndicatosDetailModalComponent } from '../performance-indicatos-detail-modal/performance-indicatos-detail-modal.component';
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
  status: number;
  user1: any;
  bsValueFromYear: Date = new Date();
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  columnFilters: any = [];
  selectedRow: any;
  userSele: any;
  resgisterdata: any;

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
    private goodPosessionThirdpartyService: GoodPosessionThirdpartyService,
    private modalService: BsModalService,
    private indUserService: IndUserService
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
    this.filterR();
    this.bsConfigFromYear = {
      dateInputFormat: 'YYYY',
      showTodayButton: false,
      isAnimated: true,
      maxDate: new Date(),
      minMode: 'year',
    };
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

  public getUser(params: ListParams) {
    params.limit = 100;
    params.take = 100;
    this.indUserService.getAllUser(params).subscribe({
      next: data => {
        this.userSele = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.userSele = new DefaultSelect();
      },
    });
  }

  validateRI(event?: any) {
    this.compliance = 0;
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
      console.log('if');
      this.compliance = this.roundPercentage(0);
    } else if (lv_numera == 0) {
      console.log('else if');
      this.compliance = this.roundPercentage(100);
    } else {
      console.log('else');
      this.compliance = this.roundPercentage(lv_denomi / lv_numera);
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
    this.getTable1(Month, year, Delegation);
    this.getTable2(Month, year, Delegation);
    window.scrollTo(0, 5);
  }
  searchA() {
    let Month = this.Form.get('month').value;
    console.log('Mes ', Month);
    let year = this.Form.get('year').value;
    console.log('Año ', year);
    let Delegation = this.Form.get('regionalCoordination').value;
    console.log('Delegacion ', Delegation);
    if (Month != null) {
      this.getTable1(Month, year, Delegation);
    }
  }

  searchR() {
    let Month = this.Form.get('month').value;
    console.log('Mes ', Month);
    let year = this.Form.get('year').value;
    console.log('Año ', year);
    let Delegation = this.Form.get('regionalCoordination').value;
    console.log('Delegacion ', Delegation);
    if (Month != null) {
      this.getTable2(Month, year, Delegation);
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
          this.data1 = [];
          this.data.load(this.data1);
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
          this.validateRI();
        },
      });
  }

  getTable2(Month: number, Year: number, delegation: number) {
    this.totRepInTime(Month, Year, delegation);
    this.data2 = [];
    this.dataF.load(this.data1);
    let params = {
      ...this.paramsI.getValue(),
      ...this.columnFilters,
    };
    this.data2 = [];
    this.dataF.load(this.data1);
    this.goodPosessionThirdpartyService
      .getByMonthYearIndicator(Month, Year, delegation, params)
      .subscribe({
        next: resp => {
          console.log('respues segunda tabla ', resp);
          for (let i = 0; i < resp.data.length; i++) {
            let params = {
              report: resp.data[i].reportKey,
              deliveredTime: resp.data[i].thisTime,
              reportNumber: resp.data[i].formatNumber,
            };
            this.data2.push(params);
            this.dataF.load(this.data2);
            this.totalItemsI = resp.count;
            this.FormE_I.patchValue({
              reportImp: resp.count,
            });
            console.log('entra');
          }
          this.validateRI();
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
          this.validateRI();
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
          this.validateRI();
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
          this.searchA();
        }
      });
    this.paramsA
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchA());
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
          this.searchR();
        }
      });
    this.paramsI
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchR());
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

  openSelect(data?: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean, registerNumber?: any) => {
          console.log('callback ', registerNumber);

          if (registerNumber != null) {
            console.log('si hay id');
            //this.getStrategyById(formatKey, id);
            this.getFormat(registerNumber);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(PerformanceIndicatosDetailModalComponent, config);
  }

  getFormat(registerNumber: any) {
    this.strategyProcessService
      .getStrategyIndicatorByRegister(registerNumber)
      .subscribe({
        next: response => {
          this.resgisterdata = response.data[0];
          this.loadUser(response.data[0].usrRegister);
          const Fin =
            response.data[0].captureDate != null
              ? new Date(response.data[0].captureDate)
              : null;
          const formattedfecFin = Fin != null ? this.formatDate(Fin) : null;
          this.Form.patchValue({
            dateCapture: formattedfecFin,
            year: response.data[0].yearNumber,
            month: response.data[0].monthNumber,
            regionalCoordination: response.data[0].delegationOneNumber,
          });
          this.validateMonth();
          this.status = response.data[0].status;
        },
      });
  }

  loadUser(user: string) {
    this.indUserService.getUser(user).subscribe({
      next: response => {
        this.userSele = new DefaultSelect(response.data, response.count);
        this.Form.get('user').setValue(response.data[0].user);
      },
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  close() {
    if (this.status == 0) {
      this.alertQuestion(
        'info',
        'Se Cerrara el Indicador. ¿Deseas continuar?',
        '',
        'Aceptar',
        'Cancelar'
      ).then(res => {
        console.log(res);
        if (res.isConfirmed) {
          this.resgisterdata.status = 1;
          this.strategyProcessService
            .PutStrategyIndicator(this.resgisterdata)
            .subscribe({
              next: response => {
                this.status = 1;
                this.alert('success', 'Cerrado Correctamente', '');
              },
            });
        }
      });
    } else {
    }
  }

  clear() {
    this.data1 = [];
    this.data.load(this.data1);
    this.data2 = [];
    this.dataF.load(this.data1);
    this.status = null;
    this.Form.reset();
    this.FormE_I.reset();
    this.totalItemsA = 0;
    this.totalItemsI = 0;
  }
}

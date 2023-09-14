import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ParameterCatService } from 'src/app/core/services/catalogs/parameter.service';
import { StrategyServiceService } from 'src/app/core/services/ms-strategy/strategy-service.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GENERAL_RECEPTION_STRATEGIES_COLUNNS } from './reception-strategies-columns';
interface IBlkcontrol {
  totalcumplido: number;
  totalNocumplido: number;
  porcentajeCunplido: number;
}
interface IGlobal {
  numberIndicator: number;
}
@Component({
  selector: 'app-reception-strategies',
  templateUrl: './reception-strategies.component.html',
  styles: [],
})
export class ReceptionStrategiesComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  blkcontrol: IBlkcontrol = {
    totalcumplido: 0,
    totalNocumplido: 0,
    porcentajeCunplido: 0,
  };
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  consulto: boolean = false;
  global: IGlobal = {
    numberIndicator: 0,
  };

  constructor(
    private excelService: ExcelService,
    private strategyService: StrategyServiceService,
    private parameterCatService: ParameterCatService
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = GENERAL_RECEPTION_STRATEGIES_COLUNNS;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.initForms();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'proceedings':
                searchFilter = SearchFilter.EQ;
                break;
              case 'captureMinutesReceptionDate':
                if (filter.search != null) {
                  filter.search = this.returnParseDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              this.params.value.page = 1;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getData();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.consulto) this.getData();
    });
  }

  initForms() {
    const params: ListParams = {};
    params['filter.certificateType'] = `$eq:EVENTREC`;
    this.parameterCatService.getParametrs(params).subscribe({
      next: resp => {
        this.global.numberIndicator = Number(resp.data[0].id);
        console.log(this.global);
      },
      error: err => {
        this.global.numberIndicator = 5;
      },
    });
  }

  getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    const model = {
      no_indicador: this.global.numberIndicator,
    };
    this.strategyService.getZCenterOperationRegional1(model, params).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.message[0] !== null) {
          this.data.load(resp.data.registros);
          this.data.refresh();
          this.blkcontrol.totalNocumplido = resp.data.totalNoCumplidos;
          this.blkcontrol.totalcumplido = resp.data.totalCumplidos;
          this.blkcontrol.porcentajeCunplido =
            (this.blkcontrol.totalcumplido /
              (this.blkcontrol.totalcumplido +
                this.blkcontrol.totalNocumplido)) *
            100;
          this.totalItems = resp.count;
        }
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  async consult(form: FormGroup) {
    this.consulto = true;
    if (form.get('fechaInicio').value === '') {
      form.get('fechaInicio').setValue(null);
    }

    if (form.get('fechaFin').value === '') {
      form.get('fechaFin').setValue(null);
    }

    if (form.get('cordinador').value === '') {
      form.get('cordinador').setValue(null);
    }

    if (form.get('usuario').value === '') {
      form.get('usuario').setValue(null);
    }

    if (
      form.get('fechaInicio').value !== null ||
      form.get('fechaFin').value !== null
    ) {
      /// receptionPhysicalDate
      this.params.getValue()[
        'filter.receptionPhysicalDate'
      ] = `$btw:${this.formatDate(
        form.get('fechaInicio').value
      )},${this.formatDate(form.get('fechaFin').value)}`;
    } else {
      delete this.params.getValue()['filter.receptionPhysicalDate'];
    }

    if (form.get('cordinador').value !== null) {
      /// coordinateAdmin
      this.params.getValue()['filter.coordinateAdmin'] = `$ilike:${
        form.get('cordinadorName').value
      }`;
    } else {
      delete this.params.getValue()['filter.coordinateAdmin'];
    }

    if (form.get('usuario').value !== null) {
      /// userNameruleOrigin
      this.params.getValue()['filter.usrActrecep'] = `$ilike:${
        form.get('usuario').value
      }`;
    } else {
      delete this.params.getValue()['filter.usrActrecep'];
    }

    this.getData();
  }

  async export(event: FormGroup) {
    console.log(event.value);
    const filename: string = 'Estrategia Recepción';
    const jsonToCsv: any[] = await this.getDataCumplido();
    if (jsonToCsv.length === 0) {
      this.alert(
        'warning',
        'Estrategia de Recepción',
        'No hay información para descargar'
      );
      return;
    }
    this.excelService.export(jsonToCsv, { type: 'csv', filename });
  }

  getDataCumplido() {
    return new Promise<any[]>((res, _rej) => {
      let params = {
        ...this.params.getValue(),
        ...this.columnFilters,
      };
      const model = {
        no_indicador: this.global.numberIndicator,
      };
      //params.limit = 999999999;
      this.strategyService
        .getZCenterOperationRegional1(model, params)
        .subscribe({
          next: (resp: any) => {
            console.log(resp);
            if (resp.message[0] !== null) {
              /// FEC_MAXIMA,FECHA_RECEP,CUMPLIO'
              const data: any[] = resp.data.registros.map((elemt: any) => {
                return {
                  EXPEDIENTE: elemt.proceedings,
                  BIEN: elemt.id,
                  ESTATUS: elemt.statusGood,
                  CVE_ACTA: elemt.keyCodeMinutesReception,
                  REGIONAL: elemt.coordinationRegional,
                  USUARIO: elemt.usrActrecep,
                  FEC_ESTRA: elemt.estgiaRecepFecCapture
                    ? elemt.estgiaRecepFecCapture
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('/')
                    : '',
                  FEC_INI_PROG: elemt.programmingRecepFecIni
                    ? elemt.programmingRecepFecIni
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('/')
                    : '',
                  FEC_FIN_PROG: elemt.programmingRecepFecFin
                    ? elemt.programmingRecepFecFin
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('/')
                    : '',
                  FEC_MAXIMA: elemt.programmingRecepFecClosing
                    ? elemt.programmingRecepFecClosing
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('/')
                    : '',
                  FECHA_RECEP: elemt.receptionPhysicalDate
                    ? elemt.receptionPhysicalDate
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('/')
                    : '',
                  CUMPLIO: elemt.cumplio,
                };
              });
              res(data);
            } else {
              res([]);
            }
          },
          error: err => {
            res([]);
          },
        });
    });
  }

  clean(event: any) {
    delete this.params.getValue()['filter.receptionPhysicalDate'];
    delete this.params.getValue()['filter.coordinateAdmin'];
    delete this.params.getValue()['filter.usrActrecep'];
    this.params.getValue().text = '';
    this.params.getValue().page = 1;
    this.params.getValue().inicio = 1;
    this.params.getValue().pageSize = 10;
    this.params.getValue().take = 10;
    this.data.load([]);
    this.data.refresh();
    this.totalItems = 0;
    this.blkcontrol.porcentajeCunplido = 0;
    this.blkcontrol.totalNocumplido = 0;
    this.blkcontrol.totalNocumplido = 0;
  }

  formatDate(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

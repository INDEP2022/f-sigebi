import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { INumerary } from 'src/app/core/models/ms-numerary/numerary.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalForm } from '../modal-form/modal-form.component';
import { RATE_CATALOG_COLUMNS } from './rate-catalog-columns';

@Component({
  selector: 'app-rate-catalog',
  templateUrl: './rate-catalog.component.html',
  styles: [],
})
export class RateCatalogComponent extends BasePage implements OnInit {
  bsValueFromYear: any;
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  form: FormGroup;
  data1: IListResponse<INumerary> = {} as IListResponse<INumerary>;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  months: any = [
    { mes: 'Enero', value: 1 },
    { mes: 'Febrero', value: 2 },
    { mes: 'Marzo', value: 3 },
    { mes: 'Abril', value: 4 },
    { mes: 'Mayo', value: 5 },
    { mes: 'Junio', value: 6 },
    { mes: 'Julio', value: 7 },
    { mes: 'Agosto', value: 8 },
    { mes: 'Septiembre', value: 9 },
    { mes: 'Octubre', value: 10 },
    { mes: 'Noviembre', value: 11 },
    { mes: 'Diciembre', value: 12 },
  ];
  v_dia: number;
  v_mes: number;
  v_anio: number;
  v_ini: number;
  minDate: Date = new Date('01/01/2000');

  constructor(
    private fb: FormBuilder,
    private numeraryServ: NumeraryService,
    private datePipe: DatePipe,
    private authService: AuthService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = RATE_CATALOG_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.edit = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;

    this.bsConfigFromYear = Object.assign(
      {},
      {
        minMode: this.minModeFromYear,
        dateInputFormat: 'YYYY',
      }
    );
  }

  //filtrado columna
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());

  ngOnInit(): void {
    this.paramsList.getValue()['sortBy'] = 'year,month:DESC';

    this.prepareForm();
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

            // const search: any = {
            //   month: () => (searchFilter = SearchFilter.EQ),
            //   year: () => (searchFilter = SearchFilter.EQ),
            //   pesos: () => (searchFilter = SearchFilter.EQ),
            //   dollars: () => (searchFilter = SearchFilter.EQ),
            //   euro: () => (searchFilter = SearchFilter.EQ),
            // };
            filter.field == 'month' ||
            filter.field == 'year' ||
            filter.field == 'pesos' ||
            filter.field == 'dollars' ||
            filter.field == 'euro'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          this.getAllNumeraryRate();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => this.getAllNumeraryRate(),
    });
  }
  prepareForm() {
    this.form = this.fb.group({
      month: [null, Validators.required],
      year: [null, Validators.required],
      ratePesos: [null, Validators.required],
      dollarRate: [null, Validators.required],
      uroRate: [null, Validators.required],
    });
  }

  clear() {
    this.form.reset();
  }

  getAllNumeraryRate() {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };

    this.numeraryServ.getAll(params).subscribe({
      next: resp => {
        this.totalItems = resp.count;
        this.data.load(resp.data);
        this.data.refresh();
        this.loading = false;
        this.data1 = resp;
        this.loading = false;
      },
      error: () => {
        this.data.load([]);
        this.data.refresh();
        this.loading = false;
      },
    });
  }

  numeraryCreate() {
    if (this.form.valid) {
      if (this.validFilter()) {
        if (this.checkRate()) return;
        const { month, year, ratePesos, dollarRate, uroRate } = this.form.value;

        const filterParams = new FilterParams();
        filterParams.removeAllFilters();
        filterParams.addFilter('month', month, SearchFilter.EQ);
        filterParams.addFilter('year', this.getYear(year), SearchFilter.EQ);
        this.numeraryServ
          .getAllWithFilter(filterParams.getFilterParams())
          .subscribe({
            next: () => {
              this.alert(
                'warning',
                'Atención',
                'La tasa de interés que se esta capturando ya existe'
              );
            },
            error: err => {
              if (err.status == 400) {
                const token = this.authService.decodeToken();
                let userId = token.username;
                const data: INumerary = {
                  tasintId: null,
                  month: month,
                  year: this.getYear(year),
                  lastDayMonth: this.obtenerFechaFinDeMes(
                    month,
                    this.getYear(year)
                  ).getDate(),
                  captureDate: this.parseDateNoOffset(new Date()),
                  user: userId.toUpperCase(),
                  dollars: dollarRate,
                  pesos: ratePesos,
                  euro: uroRate,
                };

                this.numeraryServ.create(data).subscribe({
                  next: () => {
                    this.alert(
                      'success',
                      'La tasa de interés ha sido creada',
                      ''
                    );
                    this.clear();
                    this.getAllNumeraryRate();
                  },
                  error: () => {
                    this.alert(
                      'error',
                      'Error',
                      'Ha ocurrido un error al crear la tasa interés'
                    );
                  },
                });
              } else {
                this.alert(
                  'error',
                  'Error',
                  'Ha ocurrido un error al verificar la existencia de la tasa interés'
                );
              }
            },
          });
      } else {
        this.alert(
          'warning',
          'Atención',
          'Hace falta la captura de un campo favor de ingresarlo'
        );
      }
    }
  }

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() - dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }

  public limit(limit: number, field: string, value: any) {
    if (String(value).length > limit) {
      this.form.get(field).patchValue(String(value).slice(0, limit));
    }
  }

  private validFilter(): boolean {
    const { month, year, ratePesos, dollarRate, uroRate } = this.form.value;
    return month &&
      year &&
      this.getYear(year) > 1999 &&
      ratePesos >= 0 &&
      dollarRate >= 0 &&
      uroRate >= 0
      ? true
      : false;
  }

  private checkRate(): boolean {
    const newDate = Number(this.datePipe.transform(new Date(), 'YYYYMM'));
    const { month, year } = this.form.value;
    const onlyYear = this.getYear(year);
    const selectDate = Number(
      onlyYear + (month <= month ? `0${month}` : month)
    );
    if (newDate <= selectDate) {
      this.alert(
        'warning',
        'Atención',
        'El año o el mes sobrepasa la fecha de la tasa de interés, favor de corregir'
      );
      return true;
    }

    return false;
  }

  remove(data: INumerary) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(answ => {
      if (answ.isConfirmed) {
        this.numeraryServ.remove(data.tasintId).subscribe({
          next: () => {
            this.alert('success', 'La tasa de interés ha sido eliminada', '');
            this.getAllNumeraryRate();
          },
          error: () => {
            this.alert(
              'error',
              'Error',
              'No se pudo eliminar la tasa de interés'
            );
          },
        });
      }
    });
  }

  edit(data: INumerary) {
    let config: ModalOptions = {
      initialState: {
        dataInteres: data,
        callback: async (next: boolean, data: INumerary) => {
          if (next) {
            data.lastDayMonth = this.obtenerFechaFinDeMes(
              data.month,
              data.year
            ).getDate();

            this.numeraryServ.update(data.tasintId, data).subscribe({
              next: () => {
                this.alert('success', 'Tesa interés se actualizó', '');
                this.getAllNumeraryRate();
              },
              error: () => {
                this.alert(
                  'error',
                  'Error',
                  'Ha ocurrido un error al actualizar la tasa interés'
                );
              },
            });
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalForm, config);
  }

  getYear(year: Date) {
    return Number(this.datePipe.transform(year, 'yyyy'));
  }

  obtenerFechaFinDeMes = (month: number, year: number) => {
    return new Date(Number(year), Number(month), 0);
  };
}

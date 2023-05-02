import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
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

  constructor(
    private fb: FormBuilder,
    private numeraryServ: NumeraryService,
    private datePipe: DatePipe,
    private authService: AuthService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: RATE_CATALOG_COLUMNS,
    };

    this.bsConfigFromYear = Object.assign(
      {},
      {
        minMode: this.minModeFromYear,
        dateInputFormat: 'YYYY',
      }
    );
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => this.getAllNumeraryRate(),
    });
    this.prepareForm();
  }
  prepareForm() {
    this.form = this.fb.group({
      month: [null],
      year: [null],
      ratePesos: [0],
      dollarRate: [0],
      uroRate: [0],
    });
  }

  clear() {
    this.form = this.fb.group({
      month: [null],
      year: [null],
      ratePesos: [0],
      dollarRate: [0],
      uroRate: [0],
    });
  }

  getAllNumeraryRate() {
    this.loading = true;
    this.numeraryServ.getAll(this.params.getValue()).subscribe({
      next: resp => {
        this.data1 = resp;
        this.loading = false;
      },
      error: () => {
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
              this.onLoadToast(
                'error',
                'La tasa de interés que se esta capturando ya existe',
                ''
              );
            },
            error: err => {
              if (err.status == 400) {
                const token = this.authService.decodeToken();
                let userId = token.preferred_username;
                const data: INumerary = {
                  tasintId: null,
                  month: month,
                  year: this.getYear(year),
                  lastDayMonth: 28,
                  captureDate: this.parseDateNoOffset(new Date()),
                  user: userId.toUpperCase(),
                  dollars: dollarRate,
                  pesos: ratePesos,
                  euro: uroRate,
                };

                this.numeraryServ.create(data).subscribe({
                  next: () => {
                    this.onLoadToast(
                      'success',
                      'Ha sido creado correctamente la tasa de interés',
                      ''
                    );
                    this.clear();
                    this.params.getValue().page = 1;
                    this.getAllNumeraryRate();
                  },
                  error: () => {},
                });
              }
            },
          });
      } else {
        this.onLoadToast(
          'info',
          'Hace falta la captura de un campo favor de ingresarlo',
          ''
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
      this.onLoadToast(
        'info',
        'El año o el mes sobrepasa la fecha de la tasa de interés, favor de corregir',
        ''
      );
      return true;
    }

    return false;
  }

  getYear(year: Date) {
    return Number(this.datePipe.transform(year, 'yyyy'));
  }
}

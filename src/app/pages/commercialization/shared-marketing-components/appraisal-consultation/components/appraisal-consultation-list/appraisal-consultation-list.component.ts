import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  Subject,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SocketService } from 'src/app/common/socket/socket.service';
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
import { BasePage } from 'src/app/core/shared';
import { FullService } from 'src/app/layouts/full/full.service';
import { UNEXPECTED_ERROR } from 'src/app/utils/constants/common-errors';
import { environment } from 'src/environments/environment';
import { APPRAISAL_COLUMNS } from '../../appraisal-consultation/appraisal-columns';
import {
  ApppraisalConsultationSumForm,
  AppraisalConsultationForm,
} from '../../utils/appraisal-consultation-form';

@Component({
  selector: 'appraisal-consultation-list',
  templateUrl: './appraisal-consultation-list.component.html',
  styles: [],
})
export class AppraisalConsultationListComponent
  extends BasePage
  implements OnInit
{
  totalItems = 0;
  params = new BehaviorSubject(new FilterParams());
  @Input() direction: 'M' | 'I';
  @Input() $search: Subject<void>;
  @Input() form: FormGroup<AppraisalConsultationForm>;
  @Input() sumForm: FormGroup<ApppraisalConsultationSumForm>;
  appraisals = new LocalDataSource();
  canSearch = false;
  excelLoading: boolean = false;

  get sumControls() {
    return this.sumForm.controls;
  }
  constructor(
    private appraiseService: AppraiseService,
    private fullService: FullService,
    private socketService: SocketService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: APPRAISAL_COLUMNS,
    };
  }

  search() {
    return this.$search.pipe(
      takeUntil(this.$unSubscribe),
      tap(() => {
        this.buildFilers();
      })
    );
  }

  resetTable() {
    this.sumForm.reset();
    this.appraisals.load([]);
    this.appraisals.refresh();
    this.totalItems = 0;
  }

  onExportToExcel() {
    if (!this.totalItems) {
      this.alert('warning', 'No se encontraron datos para exportar', '');
      return;
    }
    this.exportToExcel();
  }

  exportToExcel() {
    this.loader.load = true;
    const params = this.params.getValue();
    params.limit = 10000;
    params.sortBy = 'idAppraisal:ASC,idDetAppraisal:ASC';
    return this.appraiseService
      .exportAppraiseExcel(params.getParams())
      .subscribe({
        next: resp => {
          console.log(resp);
          this.excelLoading = false;
          this.alert(
            'warning',
            'El archivo excel está en proceso de generación, favor de esperar la descarga',
            ''
          );
          this.subscribeExcel(resp).subscribe();
        },
        error: () => {
          this.excelLoading = false;
          this.loader.load = false;
          this.alert('error', 'Error', 'No se Generó Correctamente el Archivo');
        },
      });

    // .pipe(
    //   catchError(error => {
    //     this.alert('error', UNEXPECTED_ERROR, '');
    //     return throwError(() => error);
    //   }),
    //   tap(response => {
    //     if (!response.base64) {
    //       this.alert('warning', 'No se encontraron datos para exportar', '');
    //       return;
    //     }
    //     this._downloadExcelFromBase64(response.base64, 'avaluos');
    //   }),
    //   finalize(() => {
    //     this.fullService.generatingFileFlag.next({
    //       progress: 100,
    //       showText: true,
    //     });
    //   })
    // );
  }
  subscribeExcel(token: any) {
    console.log(token);

    return this.socketService.goodsTrackerExcel(token.channel).pipe(
      catchError(error => {
        this.loader.load = false;
        return throwError(() => error);
      }),
      tap(res => {
        console.warn('RESPUESTA DEL SOCKET');
        console.log(res);
        if (res.path != null) {
          this.getExcel(res.path);
        }
      })
      // switchMap(() => )
    );
  }
  getExcel(path: string) {
    this.alert('success', 'Archivo Descargado Correctamente', '');
    const url = `${environment.API_URL}appraise/${environment.URL_PREFIX}/${path}`;
    console.log(url);
    window.open(url, '_blank');
    this.loader.load = false;

    // this.downloadExcel(resp.file);
  }
  buildFilers() {
    this.canSearch = false;
    const params = new FilterParams();
    const formValue: any = this.form.value;
    Object.keys(formValue).forEach(key => {
      const value = formValue[key];
      const isArray = Array.isArray(value);
      if (!this.hasValue(value)) {
        return;
      }
      this.canSearch = true;
      params.addFilter(
        key,
        this.getValue(value),
        isArray ? SearchFilter.IN : SearchFilter.EQ
      );
    });
    params.addFilter('address', this.direction);
    if (!this.canSearch) {
      this.resetTable();
    }
    this.params.next(params);
  }

  private hasValue(value: string | string[]) {
    const isArray = Array.isArray(value);
    if (isArray) {
      return value.length;
    }
    return value;
  }

  private getValue(value: string | string[]) {
    const isArray = Array.isArray(value);
    return isArray ? value.join(',') : value;
  }

  ngOnInit(): void {
    this.search().subscribe();
    this.columnsFilter().subscribe();
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => {
          if (this.canSearch) {
            this.getGoods(params).subscribe();
          }
        })
      )
      .subscribe();
  }

  columnsFilter() {
    return this.appraisals.onChanged().pipe(
      distinctUntilChanged(),
      debounceTime(500),
      takeUntil(this.$unSubscribe),
      tap(dataSource => this.buildColumnFilter(dataSource))
    );
  }

  buildColumnFilter(dataSource: any) {
    const params = new FilterParams();
    if (dataSource.action == 'filter') {
      const filters = dataSource.filter.filters;
      filters.forEach((filter: any) => {
        const columns = this.settings.columns as any;
        const operator = columns[filter.field]?.operator;
        if (!filter.search) {
          return;
        }
        params.addFilter(
          filter.field,
          filter.search,
          operator || SearchFilter.EQ
        );
      });
      this.params.next(params);
    }
  }

  getGoods(params: FilterParams) {
    this.totalItems = 0;
    this.loading = true;
    return this.appraiseService.getAppraiseByFilters(params.getParams()).pipe(
      catchError(error => {
        this.loading = false;
        this.appraisals.load([]);
        this.appraisals.refresh();
        this.totalItems = 0;
        this.sumForm.reset();
        return throwError(() => error);
      }),
      tap(response => {
        this.loading = false;
        console.log(response);
        this.appraisals.load(response.data);
        this.appraisals.refresh();
        this.totalItems = response.count;
        this.getSum(params).subscribe();
      })
    );
  }

  getSum(params: FilterParams) {
    return this.appraiseService.exportAppraiseSum(params.getParams()).pipe(
      catchError(error => {
        if (error.status >= 500) {
          this.alert('error', UNEXPECTED_ERROR, '');
        } else {
          this.sumForm.reset();
        }
        return throwError(() => error);
      }),
      tap(response => {
        this.sumForm.patchValue(response);
      })
    );
  }
}

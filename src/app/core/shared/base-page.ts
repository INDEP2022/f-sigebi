import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AES, enc } from 'crypto-js';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, filter, Subject, takeUntil, tap } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { LoadingPercentService } from 'src/app/common/services/loading-percent.service';
import { LoadingService } from 'src/app/common/services/loading.service';
import { ScreenCodeService } from 'src/app/common/services/screen-code.service';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { SweetAlertIcon } from 'sweetalert2';
import { ClassWidthAlert } from './alert-class';

interface TableSettings {
  selectMode: string;
  actions: any;
  attr: Object;
  pager: Object;
  hideSubHeader: boolean;
  mode: string;
  add: Object;
  edit: Object;
  delete: Object;
  columns: Object;
  noDataMessage: string;
  selectedRowIndex?: number;
  rowClassFunction?: any;
}
interface Action {
  columnTitle: string;
  position: string;
  add: boolean;
  edit: boolean;
  delete: boolean;
}
const TABLE_SETTINGS: TableSettings = {
  selectMode: '',
  selectedRowIndex: -1,
  actions: {
    columnTitle: 'Acciones',
    position: 'right',
    add: true,
    edit: true,
    delete: false,
  },
  attr: {
    class: 'table-bordered',
  },
  pager: {
    display: false,
  },
  hideSubHeader: true,
  mode: 'external',
  add: {},
  edit: {
    editButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
  },
  delete: {
    deleteButtonContent: '<i class="fa fa-trash text-danger mx-2"></i>',
    confirmDelete: true,
  },
  columns: {},
  noDataMessage: 'No se encontraron registros',
  rowClassFunction: (row: any) => {},
};
@Component({
  template: '',
})
export abstract class BasePage extends ClassWidthAlert implements OnDestroy {
  loading: boolean = false;
  $unSubscribe = new Subject<void>();
  minMode: BsDatepickerViewMode = 'day';
  bsConfig?: Partial<BsDatepickerConfig>;
  settings = { ...TABLE_SETTINGS };
  private readonly key = 'Pru3b4Cr1pt0S1G3B1';
  private _showHide = inject(showHideErrorInterceptorService);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private _screenCode = inject(ScreenCodeService);

  protected loader = inject(LoadingService);
  protected loaderProgress = inject(LoadingPercentService);
  protected _toastrService = inject(ToastrService);
  constructor() {
    super();
    this.bsConfig = {
      minMode: this.minMode,
      isAnimated: true,
      // minDate: new Date(),
      // maxDate: new Date(),
    };
    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.$unSubscribe),
        tap(() => {
          const screenCode =
            this._activatedRoute.snapshot.data['screen'] ?? null;
          this._screenCode.$id.next(screenCode);
        })
      )
      .subscribe();
  }

  protected onLoadToast(icon: SweetAlertIcon, title: string, text?: string) {
    const throwToast = {
      success: (title: string, text: string) =>
        this._toastrService.success(text, title),
      info: (title: string, text: string) =>
        this._toastrService.info(text, title),
      warning: (title: string, text: string) =>
        this._toastrService.warning(text, title),
      error: (title: string, text: string) =>
        this._toastrService.error(text, title),
      question: (title: string, text: string) =>
        this._toastrService.info(text, title),
    };
    return throwToast[icon](title, text);
  }

  protected encodeData<T>(data: T) {
    let value = '';
    value = AES.encrypt(
      JSON.stringify(data).trim(),
      this.key.trim()
    ).toString();
    return value;
  }

  protected decodeData<T>(data: string): T {
    const value = AES.decrypt(data.trim(), this.key.trim()).toString(enc.Utf8);
    return JSON.parse(value);
  }
  protected pageFilter(params: BehaviorSubject<ListParams>) {
    if (params.getValue().page > 1) {
      const paramsP = params.getValue();
      paramsP.page = 1;
      params.next(paramsP);
    }
    return params;
  }

  hideError(show: boolean = false) {
    this._showHide.showHideError(show);
  }

  blockErrors(condition: boolean) {
    this._showHide.blockAllErrors = condition;
  }

  ngOnDestroy(): void {
    this.$unSubscribe.next();
    this.$unSubscribe.complete();
    this._showHide.blockAllErrors = false;
  }

  handleErrorAlert(
    message: string,
    error: HttpErrorResponse,
    _status?: number
  ) {
    if (_status) {
      if (error.status == _status) this.alert('error', 'Error', message);
      return;
    }
    if (error.status < 500) {
      this.alert('error', 'Error', message);
    }
  }
}

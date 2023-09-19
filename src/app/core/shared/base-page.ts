import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AES, enc } from 'crypto-js';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  filter,
  firstValueFrom,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { LoadingPercentService } from 'src/app/common/services/loading-percent.service';
import { LoadingService } from 'src/app/common/services/loading.service';
import { ScreenCodeService } from 'src/app/common/services/screen-code.service';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
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
export const TABLE_SETTINGS: TableSettings = {
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
export abstract class BasePage
  extends ClassWidthAlert
  implements OnDestroy, AfterViewInit
{
  loading: boolean = false;
  $unSubscribe = new Subject<void>();
  minMode: BsDatepickerViewMode = 'day';
  bsConfig?: Partial<BsDatepickerConfig>;
  settings = { ...TABLE_SETTINGS };
  @ViewChildren(Ng2SmartTableComponent)
  _tables: QueryList<Ng2SmartTableComponent>;
  private readonly key = 'Pru3b4Cr1pt0S1G3B1';
  private _showHide = inject(showHideErrorInterceptorService);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private _screenCode = inject(ScreenCodeService);
  protected loader = inject(LoadingService);
  protected loaderProgress = inject(LoadingPercentService);
  protected _toastrService = inject(ToastrService);
  private _store = inject(GlobalVarsService);
  get _codeScreen() {
    return this._screenCode.$id.getValue();
  }
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
  ngAfterViewInit(): void {
    const screen = this._screenCode.$id.getValue();
    this._getGlobalVars().then(global => {
      if (screen != 'FCONGENBITACORA') {
        this._store.updateGlobalVars({
          ...global,
          G_REGISTRO_BITACORA: null,
        });
      }

      this._tables.forEach(table => {
        table.userRowSelect.subscribe(async row => {
          if (!row) {
            return;
          }
          const { isSelected, data } = row;

          const global = await this._getGlobalVars();
          if (screen == 'FCONGENBITACORA') {
            return;
          }
          let G_REGISTRO_BITACORA: string | number = null;
          if (isSelected) {
            G_REGISTRO_BITACORA = this.getRegisterNum(data);
          } else {
            G_REGISTRO_BITACORA = null;
          }
          this._store.updateGlobalVars({
            ...global,
            G_REGISTRO_BITACORA,
          });
        });
      });
    });
  }

  private getRegisterNum(data: any) {
    return (
      data?.registerNumber ??
      data?.noRegister ??
      data?.iDoNotRegister ??
      data?.registryNumber ??
      data?.registrationNumber ??
      data?.registryNum ??
      data?.noRegistration ??
      data?.numberRegister ??
      data?.no_registro ??
      data?.noRegistry ??
      data?.noRegistro ??
      data?.registerNo ??
      data?.register_number ??
      data?.numRegister ??
      data?.registrationId ??
      data?.notRecord ??
      data?.recordNot ??
      data?.numRegistre ??
      data?.registerId ??
      data?.numberRecord ??
      data?.id ??
      null
    );
  }

  private _getGlobalVars() {
    return firstValueFrom(this._store.getGlobalVars$());
  }
  protected toast(icon: SweetAlertIcon, title: string, text?: string) {
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

  protected onLoadToast(icon: SweetAlertIcon, title: string, text?: string) {
    this.alert(icon, title, text);
    // ? Se ha reemplazado lost toast por sweet alert
    // const throwToast = {
    //   success: (title: string, text: string) =>
    //     this._toastrService.success(text, title),
    //   info: (title: string, text: string) =>
    //     this._toastrService.info(text, title),
    //   warning: (title: string, text: string) =>
    //     this._toastrService.warning(text, title),
    //   error: (title: string, text: string) =>
    //     this._toastrService.error(text, title),
    //   question: (title: string, text: string) =>
    //     this._toastrService.info(text, title),
    // };
    // return throwToast[icon](title, text);
  }

  protected encodeData<T>(data: T) {
    let value = '';
    value = AES.encrypt(
      JSON.stringify(data).trim(),
      this.key.trim()
    ).toString();
    return value;
  }

  protected returnParseDate(data: any) {
    let fechaString = '';
    // Obtener los componentes de la fecha
    if (data !== '') {
      const año = data.getFullYear().toString();
      const mes = (data.getMonth() + 1).toString().padStart(2, '0');
      const dia = data.getDate().toString().padStart(2, '0');

      // Crear la cadena de texto en formato "año mes día"
      fechaString = `${año}-${mes}-${dia}`;
    }
    return fechaString;
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

  protected _downloadExcelFromBase64(base64String: string, filename: string) {
    const mediaType =
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
    const link = document.createElement('a');
    link.href = mediaType + base64String;
    link.download = `${filename ?? 'Descarga'}.xlsx`;
    link.click();
    link.remove();
    this.alert('success', 'Archivo descargado correctamente', '');
  }
}

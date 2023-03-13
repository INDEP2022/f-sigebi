import { Component, inject, OnDestroy } from '@angular/core';
import { AES, enc } from 'crypto-js';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { Subject } from 'rxjs';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import Swal, {
  SweetAlertIcon,
  SweetAlertOptions,
  SweetAlertPosition,
  SweetAlertResult,
} from 'sweetalert2';

export class SweetalertModel implements SweetAlertOptions {
  title: string;
  text: string;
  icon: SweetAlertIcon;
  footer: string;
  background: string;
  showConfirmButton: boolean;
  toast: boolean;
  showCancelButton: boolean;
  buttonsStyling: boolean;
  focusConfirm: boolean;
  focusCancel: boolean;
  showCloseButton: boolean;
  confirmButtonText: string;
  cancelButtonText: string;
  confirmButtonClass: string;
  cancelButtonClass: string;
  timer: number;
  position: SweetAlertPosition;
  constructor() {
    this.icon = 'success';
    this.toast = false;
    this.background = '';
    this.showConfirmButton = false;
    this.showCancelButton = false;
    this.confirmButtonText = 'Aceptar';
    this.cancelButtonText = 'Cancelar';
    this.showCloseButton = false;
    this.confirmButtonClass = 'btn btn-primary active btn-sm';
    this.cancelButtonClass = 'btn btn-danger active btn-sm';
    this.buttonsStyling = false;
  }
}
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
  noDataMessage: 'No se encontrarón registros',
  rowClassFunction: (row: any) => {},
};
@Component({
  template: '',
})
export abstract class BasePage implements OnDestroy {
  loading: boolean = false;
  $unSubscribe = new Subject<void>();
  minMode: BsDatepickerViewMode = 'day';
  bsConfig?: Partial<BsDatepickerConfig>;
  settings = { ...TABLE_SETTINGS };
  private readonly key = 'Pru3b4Cr1pt0S1G3B1';
  private _showHide = inject(showHideErrorInterceptorService);

  constructor() {
    this.bsConfig = {
      minMode: this.minMode,
      isAnimated: true,
      // minDate: new Date(),
      // maxDate: new Date(),
    };
  }

  protected onLoadToast(icon: SweetAlertIcon, title: string, text: string) {
    let sweetalert = new SweetalertModel();
    sweetalert.toast = true;
    sweetalert.position = 'top-end';
    sweetalert.timer = 6000;
    sweetalert.title = title;
    sweetalert.text = text;
    sweetalert.icon = icon;
    Swal.fire(sweetalert);
  }

  protected alert(icon: SweetAlertIcon, title: string, text: string) {
    let sweetalert = new SweetalertModel();
    sweetalert.title = title;
    sweetalert.text = text;
    sweetalert.icon = icon;
    sweetalert.showConfirmButton = true;
    Swal.fire(sweetalert);
  }

  protected alertQuestion(
    icon: SweetAlertIcon,
    title: string,
    text: string,
    confirmButtonText?: string,
    cancelButtonText: string = 'Cancelar'
  ): Promise<SweetAlertResult> {
    let sweetalert = new SweetalertModel();
    sweetalert.title = title;
    sweetalert.text = text;
    sweetalert.icon = icon;
    confirmButtonText ? (sweetalert.confirmButtonText = confirmButtonText) : '';
    cancelButtonText ? (sweetalert.cancelButtonText = cancelButtonText) : '';
    sweetalert.showConfirmButton = true;
    sweetalert.showCancelButton = true;
    return Swal.fire(sweetalert);
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

  hideError(show: boolean = false) {
    this._showHide.showHideError(show);
  }

  ngOnDestroy(): void {
    this.$unSubscribe.next();
    this.$unSubscribe.complete();
  }
}

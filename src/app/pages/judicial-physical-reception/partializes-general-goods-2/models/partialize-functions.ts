import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SweetalertModel } from 'src/app/core/shared/base-page';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';
import { PartializeGeneralGoodService } from '../../partializes-general-goods-1/services/partialize-general-good.service';
export class PartializeFunctions {
  protected service = inject(PartializeGeneralGoodService);
  private _toastrService = inject(ToastrService);

  get good() {
    return this.service.good;
  }

  get formGood() {
    return this.service.formGood;
  }

  get bienesPar() {
    return this.service.bienesPar;
  }
  set bienesPar(value) {
    this.service.bienesPar = value;
  }

  protected onLoadToast(icon: SweetAlertIcon, title: string, text: string) {
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

  protected validationClasif() {
    return [1424, 1426, 62].includes(+this.good.goodClassNumber);
  }
}

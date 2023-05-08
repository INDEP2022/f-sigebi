import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SweetalertModel } from 'src/app/core/shared/base-page';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';
import { PartializeGeneralGoodService } from '../services/partialize-general-good.service';

export class FunctionButtons {
  protected service = inject(PartializeGeneralGoodService);
  private _toastrService = inject(ToastrService);
  v_numerario: number;
  vfactor: number;
  loading: boolean = false;
  get good() {
    return this.service.good;
  }

  get form() {
    return this.service.formControl;
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
    return [1424, 1426, 1427, 1575, 1590].includes(+this.good.goodClassNumber);
  }

  protected async setMeasureData() {
    // const data = await firstValueFrom(
    //   this.goodService.getGoodWidthMeasure(this.good.id)
    // );
    // const { cantidad, descripcion, cve_moneda_avaluo } = {
    //   cantidad: this.good.quantity,
    //   descripcion: this.good.fraccion.description,
    //   cve_moneda_avaluo: this.good.appraisalCurrencyKey,
    // };

    return {
      v_cantidad: this.good.quantity,
      v_unidad: this.good.fraccion.description,
      v_avaluo: this.good.appraisalCurrencyKey,
    };
    // let cantidad, descripcion, cve_moneda_avaluo;
    // try {
    //   const data = await firstValueFrom(
    //     this.goodService.getGoodWidthMeasure(this.good.goodId)
    //   );
    //   cantidad = data.data[0].cantidad;
    //   descripcion = data.data[0].descripcion;
    //   cve_moneda_avaluo = data.data[0].cve_moneda_avaluo;
    // } catch (x) {}
    // return {
    //   v_cantidad: cantidad ? +cantidad : null,
    //   v_unidad: descripcion,
    //   v_avaluo: cve_moneda_avaluo,
    // };
  }
}

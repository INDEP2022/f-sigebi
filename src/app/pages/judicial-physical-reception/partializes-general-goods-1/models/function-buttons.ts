import { Component, inject, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { SweetalertModel } from 'src/app/core/shared/base-page';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';
import { PartializeGeneralGoodTab2Service } from '../services/partialize-general-good-tab2.service';
import { PartializeGeneralGoodService } from '../services/partialize-general-good.service';

@Component({
  selector: 'app-good-partialize-function-buttons',
  template: ``,
  styles: [``],
})
export class FunctionButtons {
  @Input() firstCase: boolean = null;
  private serviceTab1 = inject(PartializeGeneralGoodService);
  private serviceTab2 = inject(PartializeGeneralGoodTab2Service);
  protected goodService = inject(GoodService);
  private _toastrService = inject(ToastrService);
  v_numerario: number;
  vfactor: number;

  ngOnInit() {
    if (this.firstCase === null) {
      return;
    }
  }

  get service() {
    return this.firstCase === true ? this.serviceTab1 : this.serviceTab2;
  }

  get loading() {
    return this.service ? this.service.buttonsLoading : false;
  }
  set loading(value) {
    if (this.service) {
      this.service.buttonsLoading = value;
    }
  }
  get good() {
    return this.service?.good;
  }

  get form() {
    return this.service?.formControl;
  }

  get formGood() {
    return this.service?.formGood;
  }

  get bienesPar() {
    return this.service?.bienesPar;
  }
  set bienesPar(value) {
    if (this.service) {
      this.service.bienesPar = value;
    }
  }

  protected onLoadToast(icon: SweetAlertIcon, title: string, text: string) {
    const throwToast = {
      success: (title: string, text: string) =>
        this._toastrService.success(text, title, { timeOut: 5000 }),
      info: (title: string, text: string) =>
        this._toastrService.info(text, title, { timeOut: 5000 }),
      warning: (title: string, text: string) =>
        this._toastrService.warning(text, title, { timeOut: 5000 }),
      error: (title: string, text: string) =>
        this._toastrService.error(text, title, { timeOut: 5000 }),
      question: (title: string, text: string) =>
        this._toastrService.info(text, title, { timeOut: 5000 }),
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
    return this.service?.validationClasif();
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

    // return {
    //   v_cantidad: this.good.quantity,
    //   v_unidad: this.good.fraccion.description,
    //   v_avaluo: this.good.appraisalCurrencyKey,
    // };
    let cantidad, descripcion, cve_moneda_avaluo;
    try {
      const data = await firstValueFrom(
        this.goodService.getGoodWidthMeasure(this.good.goodId)
      );
      cantidad = data.data[0].cantidad;
      descripcion = data.data[0].descripcion;
      cve_moneda_avaluo = data.data[0].cve_moneda_avaluo;
    } catch (x) {}
    return {
      v_cantidad: cantidad ? +cantidad : 0,
      v_unidad: descripcion ?? '',
      v_avaluo: cve_moneda_avaluo ?? '',
    };
  }
}

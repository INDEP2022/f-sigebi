import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { LoadingService } from 'src/app/common/services/loading.service';
import { AlertsQueueService } from 'src/app/core/services/alerts/alerts-queue.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { SweetalertModel } from 'src/app/core/shared';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';
import { PartializeGeneralGoodService } from '../services/partialize-general-good.service';

@Component({
  selector: 'app-good-partialize-function-buttons',
  template: ``,
  styles: [``],
})
export class FunctionButtons {
  // @Input() firstCase: boolean = null;
  // @Input() version: number = null;
  version: number = 1;
  service = inject(PartializeGeneralGoodService);
  // private serviceTab2 = inject(PartializeGeneralGoodTab2Service);
  // private service2 = inject(PartializeGeneralGoodV2Service);
  // private service2Tab2 = inject(PartializeGeneralGoodV2Tab2Service);
  protected goodService = inject(GoodService);
  private _toastrService = inject(ToastrService);
  protected loader = inject(LoadingService);
  v_numerario: number;
  vfactor: number;
  private _alertsService = inject(AlertsQueueService);

  protected alert(
    icon: SweetAlertIcon,
    title: string,
    text: string,
    html?: string
  ) {
    let sweetalert = new SweetalertModel();
    sweetalert.title = title;
    sweetalert.text = text;
    sweetalert.icon = icon;
    sweetalert.html = html;
    sweetalert.showConfirmButton = true;
    this._alertsService.alerts.push(sweetalert);
    this._alertsService.alertQueue.next(true);
  }

  protected alertInfo(icon: SweetAlertIcon, title: string, text: string) {
    let sweetalert = new SweetalertModel();
    sweetalert.title = title;
    sweetalert.text = text;
    sweetalert.icon = icon;
    sweetalert.showConfirmButton = true;
    return Swal.fire(sweetalert);
  }

  ngOnInit() {
    if (this.version === null) {
      return;
    }
  }

  // get service() {
  //   return this.version === 1 ? this.service1 : this.service2;
  //   // return this.version === 1
  //   //   ? this.firstCase === true
  //   //     ? this.serviceTab1
  //   //     : this.serviceTab2
  //   //   : this.firstCase === true
  //   //   ? this.service2Tab1
  //   //   : this.service2Tab2;
  // }

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

  // get formGood() {
  //   return this.service?.formGood;
  // }

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
      console.log(data);
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

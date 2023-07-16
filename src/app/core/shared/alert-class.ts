import { inject } from '@angular/core';
import Swal, {
  SweetAlertIcon,
  SweetAlertOptions,
  SweetAlertPosition,
  SweetAlertResult,
} from 'sweetalert2';
import { AlertsQueueService } from '../services/alerts/alerts-queue.service';

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
  customClass: {
    confirmButton: string;
    cancelButton: string;
    loader?: string;
  };
  timer: number;
  html?: string;
  timerProgressBar: boolean;
  position: SweetAlertPosition;
  backdrop: string; //Propiedad para cerrar el alert cuando se presione en "Cancelar"
  allowOutsideClick: boolean; //Propiedad para cerrar el alert cuando se presione en "Cancelar"
  constructor() {
    this.icon = 'success';
    this.toast = false;
    this.background = '';
    this.showConfirmButton = false;
    this.showCancelButton = false;
    this.confirmButtonText = 'Aceptar';
    this.cancelButtonText = 'Cancelar';
    this.showCloseButton = false;
    // this.confirmButtonClass = 'btn btn-primary active btn-sm';
    // this.cancelButtonClass = 'btn btn-danger active btn-sm';
    this.customClass = {
      confirmButton: 'btn btn-primary active btn-sm',
      cancelButton: 'btn btn-danger active btn-sm',
    };
    this.buttonsStyling = false;
  }
}

export class ClassWidthAlert {
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
    sweetalert.allowOutsideClick = false;
    this._alertsService.alerts.push(sweetalert);
    this._alertsService.alertQueue.next(true);
  }

  protected alertInfo(icon: SweetAlertIcon, title: string, text: string) {
    let sweetalert = new SweetalertModel();
    sweetalert.title = title;
    sweetalert.text = text;
    sweetalert.icon = icon;
    sweetalert.showConfirmButton = true;
    sweetalert.allowOutsideClick = false;
    return Swal.fire(sweetalert);
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

    // Configurar SweetAlert para deshabilitar el cierre al hacer clic fuera del modal
    sweetalert.backdrop = 'static';
    sweetalert.allowOutsideClick = false;

    return Swal.fire(sweetalert);
  }

  // protected alertQuestion(
  //   icon: SweetAlertIcon,
  //   title: string,
  //   text: string,
  //   confirmButtonText?: string,
  //   cancelButtonText: string = 'Cancelar'
  // ): Promise<SweetAlertResult> {
  //   let sweetalert = new SweetalertModel();
  //   sweetalert.title = title;
  //   sweetalert.text = text;
  //   sweetalert.icon = icon;
  //   confirmButtonText ? (sweetalert.confirmButtonText = confirmButtonText) : '';
  //   cancelButtonText ? (sweetalert.cancelButtonText = cancelButtonText) : '';
  //   sweetalert.showConfirmButton = true;
  //   sweetalert.showCancelButton = true;
  //   return Swal.fire(sweetalert);
  // }
}

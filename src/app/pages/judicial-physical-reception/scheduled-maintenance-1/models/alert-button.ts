import { inject } from '@angular/core';
import { AlertsQueueService } from 'src/app/core/services/alerts/alerts-queue.service';
import { SweetalertModel } from 'src/app/core/shared';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

export class AlertButton {
  private _alertsService = inject(AlertsQueueService);
  alertQuestion(
    icon: SweetAlertIcon,
    title: string,
    text: string,
    confirmButtonText?: string
  ): Promise<SweetAlertResult> {
    let sweetalert = new SweetalertModel();
    sweetalert.title = title;
    sweetalert.text = text;
    sweetalert.icon = icon;
    confirmButtonText ? (sweetalert.confirmButtonText = confirmButtonText) : '';
    sweetalert.showConfirmButton = true;
    sweetalert.showCancelButton = true;
    return Swal.fire(sweetalert);
  }

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
}

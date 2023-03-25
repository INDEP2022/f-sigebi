import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { SweetalertModel } from '../../shared/base-page';

@Injectable({
  providedIn: 'root',
})
export class AlertsQueueService {
  $unSubscribe = new Subject<void>();
  alerts: SweetalertModel[] = [];
  alertQueue = new BehaviorSubject<boolean>(false);
  constructor() {
    this.alertQueue.subscribe(data => {
      if (data) this.showAlerts();
    });
  }

  async showAlerts() {
    if (this.alertQueue.getValue() && this.alerts.length > 0) {
      while (this.alerts.length > 0) {
        await Swal.fire(this.alerts[0]).then(() => {
          this.alerts.splice(0, 1);
        });
      }
    }
  }
}

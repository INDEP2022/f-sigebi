import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  successNotification(message: string, title: string){
    this.toastr.success(message);
}

infoNotification(message: string, title: string) {
    this.toastr.info(message, 'Información');
}

warningNotification(message: string, title: string) {
    this.toastr.warning(message, 'Advertencia', {
        timeOut: 3000
    });
}

errorNotification(message: string, title: string) {
    this.toastr.error(message, 'Error');
}
}

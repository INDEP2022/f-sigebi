import { Injectable } from '@angular/core';
import { _Params } from 'src/app/common/services/http.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsFileService {
  constructor(
    private msNotificationService: NotificationService,
    private msExpedientService: ExpedientService
  ) {}

  getNotificationByFileNumber(params: _Params) {
    return this.msNotificationService.getAllFilter(params);
  }
  getExpedientByIdentificator(fileNumber: number) {
    return this.msExpedientService.getById(fileNumber);
  }
}

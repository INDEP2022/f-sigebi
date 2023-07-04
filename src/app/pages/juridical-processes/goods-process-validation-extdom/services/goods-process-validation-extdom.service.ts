import { Injectable } from '@angular/core';
import { _Params } from 'src/app/common/services/http.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class GoodsProcessValidationExtdomService {
  constructor(private msNotificationService: NotificationService) {}
  getNotificationByFilters(params: _Params) {
    return this.msNotificationService.getAllFilter(params);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FlatFileNotificationsService {
  constructor(private htpp: HttpClient) {}

  getFileNotification(delegation: string, startDate: string, endDate: string) {
    const url = `${environment.API_URL}notification/api/v1/pup-launch-report/delegation/${delegation}/start-date/${startDate}/end-date/${endDate}`;
    return this.htpp.get(url);
  }
}

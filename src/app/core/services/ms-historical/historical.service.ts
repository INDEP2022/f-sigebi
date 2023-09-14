import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class HistoricalService extends HttpService {
  constructor() {
    super();
    this.microservice = 'historical';
  }

  getHistoricalConsultDelegation(params?: any) {
    return this.post('application/consul-delegacion', params);
  }
}

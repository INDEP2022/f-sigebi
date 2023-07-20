import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { IRangeDateTmp5 } from './comer-details';

@Injectable({
  providedIn: 'root',
})
export class ComerDetailsService extends HttpService {
  private readonly route = 'comer-details';
  constructor() {
    super();
    this.microservice = 'conciliation';
  }

  faCoinciliationGood(body: any) {
    return this.post(`${this.route}/fa-conciliation-good`, body);
  }

  deleteAllTable() {
    return this.delete('tmp-good-val5/');
  }

  rangeDate(body: IRangeDateTmp5) {
    return this.post('application/rangeDate', body)
  }
}

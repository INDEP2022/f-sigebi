import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class StatusGoodMassiveService extends HttpService {
  constructor() {
    super();
    this.microservice = 'goodsquery';
  }
  checkStatusMasiv(status: string) {
    const route = `z-status-cat-phase-part/check-status-masiv/${status}`;
    return this.get<any>(route);
  }
}

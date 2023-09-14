import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class InsuranceService extends HttpService {
  constructor() {
    super();
    this.microservice = 'insurance';
  }

  generateCve(NoFormat: any) {
    const route = `assets-insurance-request?filter.`;
    return this.get(route);
  }
}

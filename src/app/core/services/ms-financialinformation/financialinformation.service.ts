import { Injectable } from '@angular/core';
import { FinancialInformation } from 'src/app/common/constants/endpoints/ms-financial-information';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class BiddingService extends HttpService {
  constructor() {
    super();
    this.microservice = FinancialInformation.BasePage;
  }
}

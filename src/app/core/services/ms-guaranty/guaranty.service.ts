import { Injectable } from '@angular/core';
import { GuarantyEndpoints } from 'src/app/common/constants/endpoints/ms-guaranty';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IComerRefGuarantees } from '../../models/ms-guaranty/guaranty';

@Injectable({
  providedIn: 'root',
})
export class GuarantyService extends HttpService {
  private readonly route = GuarantyEndpoints;
  constructor() {
    super();
    this.microservice = this.route.Guaranty;
  }

  getComerRefGuarantees(params?: _Params) {
    return this.get<IListResponse<IComerRefGuarantees>>(
      this.route.ComerRefGuarantees,
      params
    );
  }
}

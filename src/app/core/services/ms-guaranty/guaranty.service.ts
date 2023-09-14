import { Injectable } from '@angular/core';
import { GuarantyEndpoints } from 'src/app/common/constants/endpoints/ms-guaranty';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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

  getComerRefGuarantees2(params?: ListParams) {
    return this.get<IListResponse<IComerRefGuarantees>>(
      this.route.ComerRefGuarantees,
      params
    );
  }

  getWarrantyReport(idEvent: number | string, params?: ListParams) {
    const routeWarranty = `${GuarantyEndpoints.ObtainGuaranteeReport}?filter.id_evento=${idEvent}`;
    return this.get<any>(routeWarranty, params);
  }
  GetTransfereexEvent(evento: any) {
    return this.get<IListResponse<IComerRefGuarantees>>(
      `${this.route.GetTransfereexEvent}/${evento}`
    );
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GuarantyEndpoints } from 'src/app/common/constants/endpoints/ms-guaranty';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
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

  getComerRefGuarantees(
    params?: ListParams
  ): Observable<IListResponse<IComerRefGuarantees>> {
    const route = `${this.route.ComerRefGuarantees}`;
    return this.get(route, params);
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

  getExcelComerRefGuarantees(params?: ListParams) {
    const route = `${this.route.GetExcelComerRefGuarantees}`;
    return this.get(route, params);
  }

  idEventXLote(params?: ListParams) {
    const route = `${this.route.getIdEventXLote}`;
    return this.get(route, params);
  }
  idEventXClient(params?: ListParams) {
    const route = `${this.route.getIdEventXClient}`;
    return this.get(route, params);
  }
}

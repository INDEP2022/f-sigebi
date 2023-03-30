import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IFinancialInformationT } from '../../models/catalogs/financial-information-model';

@Injectable({
  providedIn: 'root',
})
export class FinantialInformationService extends HttpService {
  private readonly endpoint: string = ENDPOINT_LINKS.FinancialInformation;
  constructor() {
    super();
    this.microservice = ENDPOINT_LINKS.FinancialInformation;
  }
  getAll(
    params?: ListParams
  ): Observable<IListResponse<IFinancialInformationT>> {
    return this.get<IListResponse<IFinancialInformationT>>(
      this.endpoint,
      params
    );
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.get(route);
  }
  // findGood(search: any) {
  //   const route = `${this.endpoint}${this.fiterByGood}${search}`;
  //   return this.get(route);
  // }
  // findEvent(search: any) {
  //   const route = `${this.endpoint}${this.fiterByEvent}${search}`;
  //   return this.get(route);
  // }
  // getEventById(id: number) {
  //   const route = `${this.evento}/${id}`;
  //   return this.get(route);
  // }
  // getEventAll(params?: ListParams): Observable<IListResponse<IEvent>> {
  //   return this.get<IListResponse<IEvent>>(this.evento, params);
  // }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomersEndpoints } from 'src/app/common/constants/endpoints/ms-customers-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
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

  getComerDetails(params?: string) {
    return this.get(`${this.route}`, params);
  }

  faCoinciliationGood(body: any) {
    return this.post(`${this.route}/fa-conciliation-good`, body);
  }

  deleteAllTable() {
    return this.delete('tmp-good-val5/');
  }

  rangeDate(body: IRangeDateTmp5) {
    return this.post('application/rangeDate', body);
  }

  pFmcomr612ClientxEvent1(
    idEvent: any,
    process: any
  ): Observable<IListResponse<any>> {
    return this.put<IListResponse<any>>(
      `${CustomersEndpoints.PFmcomr612ClientxEvent1}/${idEvent}/${process}`
    );
  }

  pFmcomr612ClientxEvent2(
    idEvent: any,
    sendSirsae: any
  ): Observable<IListResponse<any>> {
    return this.put<IListResponse<any>>(
      `${CustomersEndpoints.PFmcomr612ClientxEvent2}/${idEvent}/${sendSirsae}`
    );
  }

  getFcomer612Get1(idEvent: any): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(
      `${CustomersEndpoints.Fcomer612Get1}/${idEvent}`
    );
  }

  reverseEverything(body: any): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      `application/reverse-everything`,
      body
    );
  }

  actEstEve(id: any): Observable<IListResponse<any>> {
    return this.put<IListResponse<any>>(`application/actEstEve/${id}`);
  }

  pFmcomr612getAuxCount(id: any): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(
      `application/pFmcomr612getAuxCount/${id}`
    );
  }
}

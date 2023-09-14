import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgrammingGoodEndpoints } from 'src/app/common/constants/endpoints/ms-programming-good-enpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import {
  IGoodProgramming,
  IHistoryProcesdingAct,
  IPAAbrirActasPrograma,
  IPACambioStatus,
  IPACambioStatusGood,
  ITmpProgValidation,
} from 'src/app/core/models/good-programming/good-programming';
import { environment } from 'src/environments/environment';
import { IUser } from '../../models/catalogs/user.model';

@Injectable({ providedIn: 'root' })
export class ProgrammingGoodService implements ICrudMethods<IGoodProgramming> {
  private readonly route: string = ProgrammingGoodEndpoints.ProgrammingGood;
  private readonly routeHistory: string =
    ProgrammingGoodEndpoints.HistoryProcceeding;

  constructor(private httpClient: HttpClient) {}

  getAll(params?: ListParams) {
    return this.httpClient.get<IListResponse<IGoodProgramming>>(
      `${environment.API_URL}${this.route}/programming-goods`
    );
  }

  getUsersProgramming(_params?: ListParams): Observable<IListResponse<IUser>> {
    const params = this.makeParams(_params);
    const route = `${this.route}/programming-users`;
    return this.httpClient.get<IListResponse<IUser>>(
      `${environment.API_URL}/${route}?${params}`
    );
  }

  paOpenProceedingProgam(model: IPAAbrirActasPrograma) {
    return this.httpClient.post(
      `${environment.API_URL}programminggood/api/v1/programminggood/apps/open-minutes-program`,
      model
    );
  }
  paRegresaEstAnterior(model: IPAAbrirActasPrograma) {
    return this.httpClient.post(
      `${environment.API_URL}programminggood/api/v1/programminggood/apps/return-previous-status`,
      model
    );
  }

  paChangeStatus(model: IPACambioStatus) {
    return this.httpClient.post(
      `${environment.API_URL}programminggood/api/v1/programminggood/apps/change-status-actas`,
      model
    );
  }
  getTmpProgValidation(params: string) {
    return this.httpClient.get<IListResponse<ITmpProgValidation>>(
      `${environment.API_URL}programminggood/api/v1/tmp-prog-validation?${params}`
    );
  }

  updateProgramming(id: number | string, formData: Object) {
    const route = `${this.route}/programming/${id}`;
    return this.httpClient.put(`${environment.API_URL}/${route}`, formData);
  }

  updateGoodByBody(formData: Object) {
    const route = `good/api/v1/good`;
    return this.httpClient.put(`${environment.API_URL}/${route}`, formData);
  }

  createProgramming(formData: IGoodProgramming) {
    const route = `${this.route}/programming`;
    return this.httpClient.post(`${environment.API_URL}/${route}`, formData);
  }

  createGoodProgramming(formData: Object) {
    const route = `${this.route}/programming-goods`;
    return this.httpClient.post(`${environment.API_URL}/${route}`, formData);
  }

  updateGoodProgramming(formData: Object) {
    const route = `${this.route}/programming-goods`;
    return this.httpClient.put(`${environment.API_URL}/${route}`, formData);
  }

  deleteGoodProgramming(formData: Object) {
    const route = `programminggood/api/v1/programming-goods`;
    return this.httpClient.delete(`${environment.API_URL}/${route}`, {
      body: formData,
    });
  }

  showReportGoodProgramming(dataObject: Object) {
    const route = `${this.route}/programminggood/apps/programmableGoods`;
    return this.httpClient.post(`${environment.API_URL}/${route}`, dataObject);
  }

  createHistoryProcedingAct(formData: IHistoryProcesdingAct) {
    const route = `${this.routeHistory}/acts-his-foluniv-ssf3`;
    return this.httpClient.post(`${environment.API_URL}/${route}`, formData);
  }

  paChangeStatusGood(model: IPACambioStatusGood) {
    return this.httpClient.post(
      `${environment.API_URL}/programminggood/api/v1/programminggood/apps/change-status-good`,
      model
    );
  }

  updateGoodSim(actaNumber: number) {
    return this.httpClient.get(
      `${environment.API_URL}/programminggood/api/v1/programminggood/apps/update-good-sinm/${actaNumber}`
    );
  }

  createActasCtlNotifSSF3(formData: any) {
    //// cambiar cuando este el Endpoint
    const route = `${this.routeHistory}/acts-his-foluniv-ssf3`;
    return this.httpClient.post(`${environment.API_URL}/${route}`, formData);
  }

  getProgrammingDelivery(_params: ListParams) {
    const params = this.makeParams(_params);
    const delivery = ProgrammingGoodEndpoints.GetDeliverys;
    const path = `${environment.API_URL}/${this.route}/${delivery}?${params}`;

    return this.httpClient.get(path);
  }

  getProgrammingDeliveryGood(_params: ListParams) {
    const params = this.makeParams(_params);
    const deliveryGood = ProgrammingGoodEndpoints.GetDeliveryGoods;
    const path = `${environment.API_URL}/${this.route}/${deliveryGood}?${params}`;

    return this.httpClient.get(path);
  }

  updateProgrammingDeliveryGood(id: number, body: Object) {
    const deliveryGood = ProgrammingGoodEndpoints.GetDeliveryGoods;
    const path = `${environment.API_URL}/${this.route}/${deliveryGood}/${id}`;

    return this.httpClient.put(path, body);
  }

  updateAllProgrammingDeliveryGoodByIdDeliverySchedule(
    id: number,
    body: Object
  ) {
    const deliveryGood =
      ProgrammingGoodEndpoints.UpdateAllProgGoodDeliveryByIdDeliverySchedule;
    const path = `${environment.API_URL}/${this.route}/${deliveryGood}/${id}`;

    return this.httpClient.put(path, body);
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}

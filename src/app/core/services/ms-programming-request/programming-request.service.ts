import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodDelivery } from 'src/app/pages/request/scheduling-deliveries/scheduling-deliveries-form/good-delivery.interface';
import { IprogrammingDelivery } from 'src/app/pages/siab-web/sami/receipt-generation-sami/receipt-table-goods/ireceipt';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IUser } from '../../models/catalogs/user.model';
import { IGoodProgramming } from '../../models/good-programming/good-programming';
import {
  Iprogramming,
  IprogrammingDate,
} from '../../models/good-programming/programming';
import { ICatThirdView } from '../../models/ms-goods-inv/goods-inv.model';

@Injectable({ providedIn: 'root' })
export class ProgrammingRequestService {
  constructor(private http: HttpClient) {}

  deleteUserProgramming(formData: Object) {
    const route = `programminggood/api/v1/programming-users`;
    return this.http.delete(`${environment.API_URL}${route}`, {
      body: formData,
    });
  }

  getUserInfo() {
    return this.http.get(`${environment.api_external_userInfo}`);
  }

  getProgrammingId(id: number) {
    return this.http.get<Iprogramming>(
      `${environment.API_URL}programminggood/api/v1/programming/${id}`
    );
  }

  getProgramming(_params: ListParams): Observable<IListResponse<Iprogramming>> {
    const params = this.makeParams(_params);
    const route = `programminggood/api/v1/programming`;
    return this.http.get<IListResponse<Iprogramming>>(
      `${environment.API_URL}/${route}?${params}`
    );
  }

  getUsersProgramming(_params: ListParams): Observable<IListResponse<IUser>> {
    const params = this.makeParams(_params);
    const route = `programminggood/api/v1/programming-users`;
    return this.http.get<IListResponse<IUser>>(
      `${environment.API_URL}/${route}?${params}`
    );
  }

  getGoodsProgramming(_params: ListParams) {
    const params = this.makeParams(_params);
    const route = `programminggood/api/v1/programming-goods`;
    return this.http.get<IListResponse<IGoodProgramming>>(
      `${environment.API_URL}${route}`,
      { params }
    );
  }

  createGoodProgramming(formData: Object) {
    const route = `programminggood/api/v1/programming-goods`;
    return this.http.post(`${environment.API_URL}${route}`, formData);
  }

  postCatThirdView(
    _params: ListParams,
    language: Object
  ): Observable<IListResponse<ICatThirdView>> {
    const params = this.makeParams(_params);
    const route = `goodsinv/api/v1/views/cat-third-view`;
    return this.http.post<IListResponse<ICatThirdView>>(
      `${environment.API_URL}${route}?${params}`,
      language
    );
  }

  createUsersProgramming(data: Object) {
    let route = `programminggood/api/v1/programming-users`;
    return this.http.post(`${environment.API_URL}/${route}`, data);
  }

  updateUserProgramming(formData: Object) {
    let route = `programminggood/api/v1/programming-users`;
    return this.http.put(`${environment.API_URL}/${route}`, formData);
  }

  updateProgramming(id: number, formData: Object) {
    const route = `programminggood/api/v1/programming/${id}`;
    return this.http.put(`${environment.API_URL}/${route}`, formData);
  }

  getDateProgramming(formData: Object) {
    const route = `goodprocess/api/v1/util-pkg/getDate`;
    return this.http.post(`${environment.API_URL}/${route}`, formData);
  }

  reportProgrammingGoods(programmingId: number, status: string) {
    return this.http.get<IListResponse<IGoodProgramming>>(
      `${environment.API_URL}programminggood/api/v1/programmed-good/goods-excel/${status}/${programmingId}`
    );
  }

  deleteGoodsMassive(data: Object) {
    const route = `programminggood/api/v1/programminggood/apps/delete-massive-goods-schedules`;
    return this.http.delete(`${environment.API_URL}/${route}`, {
      body: data,
    });
  }

  getProgrammingByDate(
    _params: ListParams,
    formData: Object
  ): Observable<IListResponse<IprogrammingDate>> {
    const params = this.makeParams(_params);
    const route = `programminggood/api/v1/programminggood/apps/programmingByDate`;
    return this.http.post<IListResponse<IprogrammingDate>>(
      `${environment.API_URL}/${route}?${params}`,
      formData
    );
  }

  getProgrammingByDelegation(
    _params: ListParams,
    formData: Object
  ): Observable<IListResponse<IprogrammingDate>> {
    const params = this.makeParams(_params);
    const route = `programminggood/api/v1/programminggood/apps/programmingByDateAndDelReg2`;
    return this.http.post<IListResponse<IprogrammingDate>>(
      `${environment.API_URL}/${route}?${params}`,
      formData
    );
  }

  getProgrammingByDateStatus(
    _params: ListParams,
    formData: Object
  ): Observable<IListResponse<IprogrammingDate>> {
    const params = this.makeParams(_params);
    const route = `programminggood/api/v1/programminggood/apps/programmingByDateAndStatus2`;
    return this.http.post<IListResponse<IprogrammingDate>>(
      `${environment.API_URL}/${route}?${params}`,
      formData
    );
  }
  getGoodsProgrammingByDate(
    _params: ListParams,
    formData: Object
  ): Observable<IListResponse<IprogrammingDate>> {
    const params = this.makeParams(_params);
    const route = `programminggood/api/v1/programminggood/apps/programmingOfGood2`;
    return this.http.post<IListResponse<IprogrammingDate>>(
      `${environment.API_URL}/${route}?${params}`,
      formData
    );
  }
  getGoodsIdProgrammingByDate(
    _params: ListParams,
    formData: Object
  ): Observable<IListResponse<IprogrammingDate>> {
    const params = this.makeParams(_params);
    const route = `programminggood/api/v1/programminggood/apps/programmingOfGood1`;
    return this.http.post<IListResponse<IprogrammingDate>>(
      `${environment.API_URL}/${route}?${params}`,
      formData
    );
  }

  getGoodApt(
    _params: ListParams,
    formData: Object
  ): Observable<IListResponse<IprogrammingDate>> {
    const params = this.makeParams(_params);
    const route = `programminggood/api/v1/programminggood/apps/programmingOfGoodScrapIron`;
    return this.http.post<IListResponse<IprogrammingDate>>(
      `${environment.API_URL}/${route}?${params}`,
      formData
    );
  }

  getProgrammingDelivery(
    _params: ListParams
  ): Observable<IListResponse<IprogrammingDelivery>> {
    const params = this.makeParams(_params);
    const route = `programminggood/api/v1/programming-delivery`;
    return this.http.get<IListResponse<IprogrammingDelivery>>(
      `${environment.API_URL}/${route}?${params}`
    );
  }

  createProgrammingDelivery(formData: Object) {
    const route = `programminggood/api/v1/programming-delivery`;
    return this.http.post(`${environment.API_URL}/${route}`, formData);
  }

  updateProgrammingDelivery(id: number, formData: Object) {
    const route = `programminggood/api/v1/programming-delivery/${id}`;
    return this.http.put(`${environment.API_URL}/${route}`, formData);
  }

  getGoodsProgrammingDelivery(
    _params: ListParams
  ): Observable<IListResponse<IGoodDelivery>> {
    const params = this.makeParams(_params);
    const route = `programminggood/api/v1/programming-delivery-good`;
    return this.http.get<IListResponse<IGoodDelivery>>(
      `${environment.API_URL}${route}`,
      { params }
    );
  }

  createGoodProgrammingDevilery(goodDelivery: IGoodDelivery) {
    const route = `programminggood/api/v1/programming-delivery-good`;
    return this.http.post(`${environment.API_URL}${route}`, goodDelivery);
  }

  sendEmailProgrammingDelivery(data: Object) {
    const route = `programminggood/api/v1/programminggood/apps/generate-send-email`;
    return this.http.post(`${environment.API_URL}${route}`, data);
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}

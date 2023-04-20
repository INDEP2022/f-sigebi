import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgrammingGoodEndpoints } from 'src/app/common/constants/endpoints/ms-programming-good-enpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IGoodProgramming } from 'src/app/core/models/good-programming/good-programming';
import { environment } from 'src/environments/environment';
import { IUser } from '../../models/catalogs/user.model';

@Injectable({ providedIn: 'root' })
export class ProgrammingGoodService implements ICrudMethods<IGoodProgramming> {
  private readonly route: string = ProgrammingGoodEndpoints.ProgrammingGood;
  constructor(private httpClient: HttpClient) {}

  getAll(params?: ListParams): Observable<IListResponse<IGoodProgramming>> {
    return this.httpClient.get<IListResponse<IGoodProgramming>>(
      `${environment.API_URL}${this.route}/api/v1/programmingGoods`
    );
  }

  getUsersProgramming(_params?: ListParams): Observable<IListResponse<IUser>> {
    const params = this.makeParams(_params);
    const route = `${this.route}/programming-users`;
    return this.httpClient.get<IListResponse<IUser>>(
      `${environment.API_URL}/${route}`,
      { params }
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

  createGoodsService(formData: Object) {
    const route = `${this.route}/programming-goods`;
    return this.httpClient.post(`${environment.API_URL}/${route}`, formData);
  }

  deleteGoodProgramming(formData: Object) {
    const route = `programminggood/api/v1/programming-goods`;
    return this.httpClient.delete(`${environment.API_URL}/${route}`, {
      body: formData,
    });
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}

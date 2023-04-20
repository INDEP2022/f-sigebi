import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { FlierEndpoints } from '../../../common/constants/endpoints/ms-flier-endpoints';
import {
  ICopiesxFlier,
  IDataAttributeGoodFunctionData,
  IExpedientDetailFunctionData,
  INotificationDetailFunctionData,
} from '../../models/ms-flier/tmp-doc-reg-management.model';

@Injectable({
  providedIn: 'root',
})
export class CopiesXFlierService extends HttpService {
  private readonly endpoint: string = FlierEndpoints.CopiesxFlier;
  constructor() {
    super();
    this.microservice = FlierEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<ICopiesxFlier>> {
    return this.get<IListResponse<ICopiesxFlier>>(this.endpoint, params);
  }

  getAllFiltered(params?: string): Observable<IListResponse<ICopiesxFlier>> {
    return this.get<IListResponse<ICopiesxFlier>>(this.endpoint, params);
  }

  /**
   * @deprecated
   */
  getById(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.get(route);
  }

  create(body: ICopiesxFlier) {
    return this.post(this.endpoint, body);
  }

  update(body: Partial<ICopiesxFlier>) {
    const route = `${this.endpoint}`;
    return this.put(route, body);
  }

  remove(body: { copyNumber: number; flierNumber: number }) {
    return this.delete(this.endpoint, body);
  }

  getNotificationDetail(
    id: string | number
  ): Observable<INotificationDetailFunctionData> {
    return this.get<INotificationDetailFunctionData>(
      `${FlierEndpoints.FnNotificationDetail}/${id}`
    );
  }

  getExpedientDetail(
    id: string | number
  ): Observable<IExpedientDetailFunctionData> {
    return this.get<IExpedientDetailFunctionData>(
      `${FlierEndpoints.FnExpedientDetail}/${id}`
    );
  }

  getGoodAttributeData(
    id: string | number
  ): Observable<IDataAttributeGoodFunctionData> {
    return this.get<IDataAttributeGoodFunctionData>(
      `${FlierEndpoints.FnDataAttributeGood}/${id}`
    );
  }

  findByIds(ids: {
    copyNumber: string | number;
    flierNumber: string | number;
  }): Observable<ICopiesxFlier> {
    return this.post(FlierEndpoints.FindByIds, ids);
  }
}

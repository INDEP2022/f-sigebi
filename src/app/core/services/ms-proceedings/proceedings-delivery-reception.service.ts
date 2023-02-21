import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { ProceedingsEndpoints } from '../../../common/constants/endpoints/ms-proceedings-endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IProceedings } from '../../models/ms-proceedings/proceedings.model';

@Injectable({
  providedIn: 'root',
})
export class ProceedingsDeliveryReceptionService extends HttpService {
  private readonly endpoint = ProceedingsEndpoints.DetailProceedingsReception;
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IProceedings>> {
    return this.get<IListResponse<IProceedings>>(this.endpoint);
  }

  getAllProceedingsDeliveryReception(params?: ListParams): Observable<IListResponse<IProceedings>> {
    return this.get<IListResponse<IProceedings>>(ProceedingsEndpoints.ProceedingsDeliveryReception, params);
  }

  getProceedingsByKey(id: string | number): Observable<IListResponse<IProceedings>> {
    const route = `${ProceedingsEndpoints.ProceedingsDeliveryReception}/${id}`;
    return this.get<IListResponse<IProceedings>>(route);
  }
}

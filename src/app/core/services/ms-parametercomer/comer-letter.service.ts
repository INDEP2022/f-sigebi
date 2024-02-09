import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComerLetterEndpoints } from 'src/app/common/constants/endpoints/comer-letter-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import {
  IComerLetter,
  IComerLetterResp,
} from '../../models/ms-parametercomer/comer-letter';

@Injectable({
  providedIn: 'root',
})
export class ComerLetterService extends HttpService {
  private readonly endpoint: string = ComerLetterEndpoints.ComerBase;
  private readonly endpint1: string = ComerLetterEndpoints.CartasLib;
  constructor() {
    super();
    this.microservice = ComerLetterEndpoints.ComerBase;
  }

  getAll(params?: ListParams): Observable<IListResponse<IComerLetter>> {
    return this.get<IListResponse<IComerLetter>>(this.endpint1, params);
  }
  getById(id: string | number): Observable<IComerLetter> {
    return this.get(`${this.endpint1}/${id}`);
  }
  getByIdResponsability(id: string | number): Observable<IComerLetterResp> {
    return this.get(`${ComerLetterEndpoints.CartasResp}/${id}`);
  }

  getAll_(params?: ListParams): Observable<IListResponse<IComerLetter>> {
    return this.get<IListResponse<IComerLetter>>(this.endpint1, params);
  }
  createLib(params: any) {
    return this.post<IListResponse<IComerLetter>>(this.endpint1, params);
  }
  removeLib(id: any) {
    return this.delete<IListResponse<IComerLetter>>(`${this.endpint1}/${id}`);
  }
  updateLib(params: any, id: string | number) {
    return this.put<IListResponse<IComerLetter>>(
      `${this.endpint1}/${id}`,
      params
    );
  }
}

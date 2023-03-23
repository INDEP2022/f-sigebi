import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LotEndpoints } from 'src/app/common/constants/endpoints/ms-lot-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IComerLot } from '../../models/ms-parametercomer/parameter';

@Injectable({
  providedIn: 'root',
})
export class ComerLotService extends HttpService {
  private readonly endpoint: string = LotEndpoints.ComerLot;
  constructor() {
    super();
    this.microservice = LotEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IComerLot>> {
    return this.get<IListResponse<IComerLot>>(this.endpoint, params);
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.get(route);
  }
}

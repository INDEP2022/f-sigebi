import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DepositEndPoints } from 'src/app/common/constants/endpoints/ms-deposit';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDetailInterestReturn } from '../../models/ms-deposit/detail-interest-return';

@Injectable({
  providedIn: 'root',
})
export class DetailInterestReturnService extends HttpService {
  private readonly endpoint: string = DepositEndPoints.DetailInsertReturn;
  constructor() {
    super();
    this.microservice = DepositEndPoints.Deposit;
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/pbCalculateDetail/${id}`;
    return this.get(route);
  }

  getAll(
    params?: ListParams
  ): Observable<IListResponse<IDetailInterestReturn>> {
    const route = `${this.endpoint}`;
    return this.get<IListResponse<IDetailInterestReturn>>(route, params);
  }
}

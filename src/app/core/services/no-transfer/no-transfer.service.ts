import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

import { TransfergoodEndpoint } from 'src/app/common/constants/endpoints/transfergood-endpoint';
import { INoTransfer } from '../../models/no-transfer/no-transfer';

@Injectable({
  providedIn: 'root',
})
export class NoTransferService extends HttpService {
  constructor() {
    super();
    this.microservice = TransfergoodEndpoint.BasePath;
  }

  getNoTransfer(id?: any, params?: ListParams): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      'application/get-EventData',
      id,
      params
    );
  }

  getAllNoTransfer(
    params?: ListParams | string
  ): Observable<IListResponse<INoTransfer>> {
    const route = TransfergoodEndpoint.TransferorNo;
    return this.get<IListResponse<INoTransfer>>(route, params);
  }

  createNoTransfer(body: Object) {
    const route = TransfergoodEndpoint.TransferorNo;
    return this.post(route, body);
  }

  updateNoTransfer(body: INoTransfer) {
    const route = `${TransfergoodEndpoint.TransferorNo}/${body.goodNumbertransferredId}`;
    return this.put(route, body);
  }

  removeNoTransfer(id: number | string) {
    const route = `${TransfergoodEndpoint.TransferorNo}/${id}`;
    return this.delete(route);
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}

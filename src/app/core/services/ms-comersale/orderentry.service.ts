import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderEntryEndpoints } from 'src/app/common/constants/endpoints/ms-orderentry-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class orderentryService extends HttpService {
  constructor() {
    super();
    this.microservice = OrderEntryEndpoints.BasePath;
  }

  getorderentry(id?: any, params?: ListParams): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      'application/get-EventData',
      id,
      params
    );
  }
}

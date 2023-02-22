import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThirdPartyEndpoints } from 'src/app/common/constants/endpoints/ms-third-party-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITypeEventXtercomer } from '../../models/ms-thirdparty/third-party.model';

@Injectable({
  providedIn: 'root',
})
export class TypeEventXterComerService extends HttpService {
  constructor() {
    super();
    this.microservice = ThirdPartyEndpoints.BasePath;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<ITypeEventXtercomer>> {
    return this.get<IListResponse<ITypeEventXtercomer>>(
      ThirdPartyEndpoints.TypeEventsXterComer,
      params
    );
  }

  getById(id: string | number): Observable<IListResponse<ITypeEventXtercomer>> {
    const route = `${ThirdPartyEndpoints.TypeEventsXterComer}/${id}/4`;
    return this.get<IListResponse<ITypeEventXtercomer>>(route);
  }
}

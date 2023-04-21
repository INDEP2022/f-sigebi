import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RejectedGoodEndpoint } from 'src/app/common/constants/endpoints/ms-rejectedgood-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGetGoodResVe } from '../../models/ms-rejectedgood/get-good-goodresdev';

@Injectable({
  providedIn: 'root',
})
export class GetGoodResVeService extends HttpService {
  constructor() {
    super();
    this.microservice = RejectedGoodEndpoint.BasePath;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IGetGoodResVe>> {
    return this.get<IListResponse<IGetGoodResVe>>(
      RejectedGoodEndpoint.GetGoodResDev,
      params
    );
  }
}

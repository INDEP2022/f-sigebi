import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoodsQueryEndpoints } from 'src/app/common/constants/endpoints/ms-good-query-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ApplicationGoodsQueryService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodsQueryEndpoints.BasePath;
  }

  getDictamenSeq(pNumber: number) {
    return this.get(`${GoodsQueryEndpoints.OpinionDelRegSeq}/${pNumber}`);
  }
  getAllUnitsQ(params?: ListParams): Observable<IListResponse<any>> {
    return this.get(`${GoodsQueryEndpoints.UnitsQuery}`, params);
  }
}

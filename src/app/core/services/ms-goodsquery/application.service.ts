import { Injectable } from '@angular/core';
import { GoodsQueryEndpoints } from 'src/app/common/constants/endpoints/ms-good-query-endpoints';
import { HttpService } from 'src/app/common/services/http.service';

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
}

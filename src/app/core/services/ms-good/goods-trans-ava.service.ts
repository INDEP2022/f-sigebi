import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { GoodEndpoints } from '../../../common/constants/endpoints/ms-good-endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodsTransAva } from '../../models/ms-good/goods-trans-ava.model';
@Injectable({
  providedIn: 'root',
})
export class GoodTransAvaService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodEndpoints.Good;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IGoodsTransAva>> {
    return this.get<IListResponse<IGoodsTransAva>>(
      GoodEndpoints.GoodsTransAva,
      params
    );
  }
  getById(id: string | number, params?: ListParams) {
    const route = `${GoodEndpoints.GoodsTransAva}/${id}`;
    return this.get(route, params);
  }

  create(model: IGoodsTransAva) {
    return this.post(GoodEndpoints.GoodsTransAva, model);
  }

  update(model: IGoodsTransAva) {
    const route = `${GoodEndpoints.GoodsTransAva}`;
    return this.put(route, model);
  }
}

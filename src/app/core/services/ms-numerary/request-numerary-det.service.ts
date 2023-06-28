import { Injectable } from '@angular/core';
import { NumeraryEndpoints } from 'src/app/common/constants/endpoints/ms-numerary';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { NumDetGoodsDetail } from 'src/app/pages/administrative-processes/numerary/numerary-request/models/goods-det';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class RequestNumeraryDetService extends HttpService {
  private readonly route = NumeraryEndpoints;

  constructor() {
    super();
    this.microservice = this.route.Numerary;
  }

  getAllFilter(params?: ListParams | string) {
    return this.get<IListResponse<NumDetGoodsDetail>>(
      this.route.RequestDet,
      params
    );
  }

  create(data: NumDetGoodsDetail) {
    return this.post(this.route.RequestDet, data);
  }

  update(data: NumDetGoodsDetail) {
    return this.put(this.route.RequestDet, data);
  }

  remove(data: NumDetGoodsDetail) {
    return this.delete(this.route.RequestDet, data);
  }

  removeAll(id: number) {
    return this.delete(`${this.route.Application}/${id}`);
  }
}

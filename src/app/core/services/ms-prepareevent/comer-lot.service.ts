import { Injectable } from '@angular/core';
import { PrepareEventEndpoints } from 'src/app/common/constants/endpoints/ms-prepareevent-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IComerLot } from '../../models/ms-prepareevent/comer-lot.model';

@Injectable({
  providedIn: 'root',
})
export class ComerLotService extends HttpService {
  constructor() {
    super();
    this.microservice = PrepareEventEndpoints.PreparaEvent;
  }

  getAllFilter(params?: _Params) {
    return this.get<IListResponse<IComerLot>>('comer-lot', params);
  }

  getAllFilterPostQuery(params: _Params) {
    return this.get<IListResponse<IComerLot>>('comer-lot/post-query', params);
  }

  create(lot: Object) {
    return this.post<IComerLot>('comer-lot', lot);
  }

  update(id: string | number, lot: Object) {
    return this.put<IComerLot>('comer-lot/' + id, lot);
  }

  remove(id: string | number) {
    return this.delete('comer-lot/' + id);
  }
}

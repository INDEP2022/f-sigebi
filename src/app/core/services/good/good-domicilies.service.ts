import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { GoodEndpoints } from '../../../common/constants/endpoints/ms-good-endpoints';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDomicilies } from '../../models/good/good.model';

@Injectable({
  providedIn: 'root',
})
export class GoodDomiciliesService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodEndpoints.Good;
  }

  getAll(params?: ListParams | string): Observable<IListResponse<IDomicilies>> {
    return this.get<IListResponse<IDomicilies>>('domicilies', params);
  }

  getById(id: string | number) {
    const route = `${GoodEndpoints.Domicilies}/${id}`;
    return this.get<IDomicilies>(route);
  }

  create(domicilie: IDomicilies) {
    return this.post(GoodEndpoints.Domicilies, domicilie);
  }

  update(id: string | number, domicilie: IDomicilies) {
    const route = `${GoodEndpoints.Domicilies}/${id}`;
    return this.put(route, domicilie);
  }

  remove(id: string | number) {
    const route = `${GoodEndpoints.Domicilies}/${id}`;
    return this.delete(route);
  }
}

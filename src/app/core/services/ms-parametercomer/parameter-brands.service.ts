import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParameterComerEndpoints } from 'src/app/common/constants/endpoints/ms-parametercomer-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IBrand } from '../../models/ms-parametercomer/parameter';

@Injectable({
  providedIn: 'root',
})
export class ParameterBrandsService extends HttpService {
  route: string = ParameterComerEndpoints.Brand;
  constructor() {
    super();
    this.microservice = ParameterComerEndpoints.BasePath;
  }

  getAll(params?: any): Observable<IListResponse<IBrand>> {
    return this.get<IListResponse<IBrand>>(this.route, params);
  }

  getById(id: string | number) {
    const route = `${this.route}/id/${id}`;
    return this.get(route);
  }

  create(tpenalty: IBrand) {
    return this.post(this.route, tpenalty);
  }

  update(id: string | number, tpenalty: IBrand) {
    const route = `${this.route}/${id}`;
    return this.put(route, tpenalty);
  }

  remove(id: string | number) {
    const route = `${this.route}/id/${id}`;
    return this.delete(route);
  }
}

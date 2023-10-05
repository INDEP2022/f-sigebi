import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParameterComerEndpoints } from 'src/app/common/constants/endpoints/ms-parametercomer-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  IBrand,
  ISubBrandsModel,
  IUpdateSubBrandsModel,
} from '../../models/ms-parametercomer/parameter';

@Injectable({
  providedIn: 'root',
})
export class ParameterBrandsService extends HttpService {
  route: string = ParameterComerEndpoints.Brand;
  route2: string = ParameterComerEndpoints.SubBrand;
  constructor() {
    super();
    this.microservice = ParameterComerEndpoints.BasePath;
  }

  getAll(params?: any): Observable<IListResponse<IBrand>> {
    return this.get<IListResponse<IBrand>>(this.route, params);
  }

  getById(id: string | number, params?: string) {
    const route = `${this.route}/id/${id}`;
    return this.get(route, params);
  }

  getByBrand(id: string | number, params?: string) {
    const route = `${this.route2}?filter.idBrand=$eq:${id}`;
    return this.get(route, params);
  }

  create(tpenalty: IBrand) {
    return this.post(this.route, tpenalty);
  }

  update(id: string | number, tpenalty: IBrand) {
    const route = this.route;
    return this.put(`${this.route}/id/${id}`, tpenalty);
  }

  remove(id: string | number) {
    const route = `${this.route}/id/${id}`;
    return this.delete(route);
  }

  removeSubBrand(model: ISubBrandsModel) {
    return this.delete(this.route2, model);
  }

  updateSubBrand(model: IUpdateSubBrandsModel) {
    return this.put(this.route2, model);
  }

  getSuperUser(params?: string) {
    console.log(params);
    return this.get(ParameterComerEndpoints.ParameterMod, params);
  }

  getSuperUserFilter(params: ListParams) {
    return this.get(ParameterComerEndpoints.ParameterMod, params);
  }
}

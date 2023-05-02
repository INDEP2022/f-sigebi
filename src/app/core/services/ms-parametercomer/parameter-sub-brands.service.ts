import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParameterComerEndpoints } from 'src/app/common/constants/endpoints/ms-parametercomer-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISubBrands } from '../../models/ms-parametercomer/parameter';

@Injectable({
  providedIn: 'root',
})
export class ParameterSubBrandsService extends HttpService {
  route: string = ParameterComerEndpoints.SubBrand;
  constructor() {
    super();
    this.microservice = ParameterComerEndpoints.BasePath;
  }

  getAll(params?: any): Observable<IListResponse<ISubBrands>> {
    return this.get<IListResponse<ISubBrands>>(this.route, params);
  }

  getById(id: string | number) {
    const route = `${this.route}/id/${id}`;
    return this.get(route);
  }

  create(tpenalty: ISubBrands) {
    return this.post(this.route, tpenalty);
  }

  update(id: string | number, tpenalty: ISubBrands) {
    const route = `${this.route}/id/${id}`;
    return this.put(route, tpenalty);
  }

  remove(subBrand: ISubBrands) {
    const route = `${this.route}`;
    return this.delete(route, subBrand);
  }
}

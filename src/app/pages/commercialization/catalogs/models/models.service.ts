import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParameterComerEndpoints } from 'src/app/common/constants/endpoints/ms-parametercomer-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IParameterComer } from 'src/app/core/models/catalogs/parameter-comer.model';

@Injectable({
  providedIn: 'root',
})
export class ModelsService extends HttpService {
  private readonly route: string = ParameterComerEndpoints.ComerModels;
  constructor() {
    super();
    this.microservice = ParameterComerEndpoints.BasePath;
  }

  getAll(params?: string): Observable<IListResponse<IParameterComer>> {
    return this.get<IListResponse<any>>(this.route, params);
  }

  getAll2(
    modelName: string,
    params?: ListParams | string
  ): Observable<IListResponse<IParameterComer>> {
    const route = `${this.route}?filter.id=$ilike:${modelName}`;
    return this.get<IListResponse<IParameterComer>>(route, params);
  }

  getModels(text?: string) {
    return this.get<IListResponse<any>>(this.route);
  }

  create(model: IParameterComer): Observable<IParameterComer> {
    return this.post(this.route, model);
  }

  update(
    id: string | number,
    model: IParameterComer
  ): Observable<IParameterComer> {
    return this.put(`${this.route}/${id}`, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.delete(`${this.route}/${id}`);
  }
}

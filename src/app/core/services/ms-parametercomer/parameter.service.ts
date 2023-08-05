import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ParameterComerEndpoints } from '../../../common/constants/endpoints/ms-parametercomer-endpoints';
import {
  IParameter,
  ITypeEvent,
} from '../../models/ms-parametercomer/parameter';

@Injectable({
  providedIn: 'root',
})
export class ParameterModService
  extends HttpService
  implements ICrudMethods<IParameter>
{
  private readonly route: string = ParameterComerEndpoints.ParameterMod;
  private readonly routeTypeEvent: string = ENDPOINT_LINKS.tevents;
  constructor(
    private parameterRepository: Repository<IParameter>,
    private typeEventRepository: Repository<ITypeEvent>
  ) {
    super();
    this.microservice = ParameterComerEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IParameter>> {
    return this.get(this.route, params);
  }

  getTypeEvent(params: ListParams) {
    return this.typeEventRepository.getAllPaginated(
      this.routeTypeEvent,
      params
    );
  }

  getById(id: string | number): Observable<IParameter> {
    return this.get(`${this.route}/id/${id}`);
  }

  create(tpenalty: Partial<IParameter>): Observable<IParameter> {
    return this.post(this.route, tpenalty);
  }

  update(id: string, tpenalty: Partial<IParameter>): Observable<Object> {
    return this.put(`${this.route}/id/${id}`, tpenalty);
  }

  updateNew(tpenalty: IParameter): Observable<Object> {
    return this.put(`${this.route}`, tpenalty);
  }

  remove(id: string | number) {
    const route = `${this.route}/id/${id}`;
    return this.delete(route);
  }

  newRemove(model: IParameter) {
    const route = `${this.route}`;
    return this.delete(route, model);
  }

  validUser(data: { user: string }) {
    return this.post(ParameterComerEndpoints.ApplicationUser, data);
  }

  //COMER_PARAMETROSMOD
  getParamterMod(params?: string) {
    return this.get(`parameters-mod`, params);
  }

  //COMER_STATUS_VTA
  getParameterStatus(params?: string) {
    return this.get(`comer-status-vta`, params);
  }

  getAsigna(user: string, adress: string) {
    return this.get(
      `${ParameterComerEndpoints.ApplicationSigna}?user=${user}&address=${adress}`
    );
  }
}

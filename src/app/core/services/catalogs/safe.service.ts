import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SafeEndpoints } from 'src/app/common/constants/endpoints/safe-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISafe, ISafe2 } from '../../models/catalogs/safe.model';
@Injectable({
  providedIn: 'root',
})
export class SafeService extends HttpService implements ICrudMethods<ISafe> {
  private readonly route: string = ENDPOINT_LINKS.Safe;
  constructor(private safeRepository: Repository<ISafe>) {
    super();
    this.microservice = SafeEndpoints.BaseaPath;
  }

  getAllFilter(params: _Params) {
    return this.get<IListResponse<ISafe>>('safe', params);
  }

  getAllFilterSelf(self?: SafeService, params?: _Params) {
    return self.get<IListResponse<ISafe>>('safe', params);
  }

  getAll(params?: ListParams): Observable<IListResponse<ISafe>> {
    return this.safeRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ISafe> {
    return this.safeRepository.getById(this.route, id);
  }

  create(model: ISafe): Observable<ISafe> {
    return this.safeRepository.create(this.route, model);
  }

  update(id: string | number, model: ISafe2): Observable<Object> {
    return this.safeRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.safeRepository.remove(this.route, id);
  }

  getAll2(params?: ListParams | string): Observable<IListResponse<ISafe>> {
    return this.get<IListResponse<ISafe>>(SafeEndpoints.Safe, params);
  }

  getById2(id: string | number) {
    const route = `${SafeEndpoints.Safe}/${id}`;
    return this.get<ISafe2>(route);
  }

  create2(model: ISafe) {
    return this.post(SafeEndpoints.Safe, model);
  }

  // update2(id: string | number, model?: ISafe){
  //   const route = `${SafeEndpoints.Safe}`;
  //   return this.put(route, id, model);
  // }

  remove2(id: string | number) {
    const route = `${SafeEndpoints.Safe}/${id}`;
    return this.delete(route);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITypeSiniester } from '../../models/catalogs/type-siniester.model';
@Injectable({
  providedIn: 'root',
})
export class TypeSiniesterService
  extends HttpService
  implements ICrudMethods<ITypeSiniester>
{
  private readonly route: string = ENDPOINT_LINKS.TypeSiniesters;
  private readonly route1: string = ENDPOINT_LINKS.Conclusion;
  constructor(
    private typeSiniesterRepository: Repository<ITypeSiniester>,
    private htpp: HttpClient
  ) {
    super();
  }

  getAll(params?: ListParams): Observable<IListResponse<ITypeSiniester>> {
    return this.typeSiniesterRepository.getAllPaginated(this.route, params);
  }
  getAllConclusion(params?: ListParams): Observable<any> {
    const url = `${environment.API_URL}catalog/api/v1/apps/getConclusion`;
    return this.htpp.get(url, { params });
    // return this.get(this.route1, params);
  }
  getStatusSinister(params?: ListParams): Observable<any> {
    const url = `${environment.API_URL}catalog/api/v1/apps/sp-get-status-sinister`;
    return this.htpp.get(url, { params });
    // return this.get(this.route1, params);
  }

  getById(id: string | number): Observable<ITypeSiniester> {
    return this.typeSiniesterRepository.getById(this.route, id);
  }

  create(model: ITypeSiniester): Observable<ITypeSiniester> {
    return this.typeSiniesterRepository.create(this.route, model);
  }

  /*update(id: string | number, model: ITypeSiniester): Observable<Object> {
    return this.typeSiniesterRepository.update(this.route, id, model);
  }*/

  newUpdate(model: ITypeSiniester): Observable<Object> {
    return this.typeSiniesterRepository.newUpdate(this.route, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.typeSiniesterRepository.remove(this.route, id);
  }
}

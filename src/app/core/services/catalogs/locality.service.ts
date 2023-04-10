import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ILocality } from '../../models/catalogs/locality.model';
@Injectable({
  providedIn: 'root',
})
export class LocalityService implements ICrudMethods<ILocality> {
  private readonly route: string = ENDPOINT_LINKS.Locality;
  constructor(private localityRepository: Repository<ILocality>) {}

  getAll(params?: ListParams): Observable<IListResponse<ILocality>> {
    return this.localityRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ILocality> {
    return this.localityRepository.getById(this.route, id);
  }

  create(model: ILocality): Observable<ILocality> {
    return this.localityRepository.create(this.route, model);
  }

  postById(formData: Object) {
    return this.localityRepository.create('catalog/locality-sera/id', formData);
  }

  update(id: string | number, model: ILocality): Observable<Object> {
    return this.localityRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.localityRepository.remove(this.route, id);
  }
}

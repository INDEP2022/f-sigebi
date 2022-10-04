import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IServiceCat } from '../../models/catalogs/service-cat.model';
@Injectable({
  providedIn: 'root',
})
export class ServiceCatService implements ICrudMethods<IServiceCat> {
  private readonly route: string = ENDPOINT_LINKS.ServiceCat;
  constructor(private serviceCatRepository: Repository<IServiceCat>) {}

  getAll(params?: ListParams): Observable<IListResponse<IServiceCat>> {
    return this.serviceCatRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IServiceCat> {
    return this.serviceCatRepository.getById(this.route, id);
  }

  create(model: IServiceCat): Observable<IServiceCat> {
    return this.serviceCatRepository.create(this.route, model);
  }

  update(id: string | number, model: IServiceCat): Observable<Object> {
    return this.serviceCatRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.serviceCatRepository.remove(this.route, id);
  }
}

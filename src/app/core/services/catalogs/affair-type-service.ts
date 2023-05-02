import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IAffairType } from '../../models/catalogs/affair-type-model';
@Injectable({
  providedIn: 'root',
})
export class AffairTypeService implements ICrudMethods<IAffairType> {
  private readonly route: string = ENDPOINT_LINKS.AffairType;
  constructor(private affairTypeRepository: Repository<IAffairType>) {}

  getAll(params?: ListParams): Observable<IListResponse<IAffairType>> {
    return this.affairTypeRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IAffairType> {
    return this.affairTypeRepository.getById(this.route, id);
  }

  create(model: IAffairType): Observable<IAffairType> {
    return this.affairTypeRepository.create(this.route, model);
  }

  update(id: string | number, model: IAffairType): Observable<Object> {
    return this.affairTypeRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.affairTypeRepository.remove(this.route, id);
  }
}

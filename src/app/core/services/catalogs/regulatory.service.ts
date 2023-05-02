import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IRegulatory } from '../../models/catalogs/regulatory.model';
@Injectable({
  providedIn: 'root',
})
export class RegulatoryService implements ICrudMethods<IRegulatory> {
  private readonly route: string = ENDPOINT_LINKS.Regulatory;
  constructor(private regulatoryRepository: Repository<IRegulatory>) {}

  getAll(params?: ListParams): Observable<IListResponse<IRegulatory>> {
    return this.regulatoryRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IRegulatory> {
    return this.regulatoryRepository.getById(this.route, id);
  }

  create(model: IRegulatory): Observable<IRegulatory> {
    return this.regulatoryRepository.create(this.route, model);
  }

  update(id: string | number, model: IRegulatory): Observable<Object> {
    return this.regulatoryRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.regulatoryRepository.remove(this.route, id);
  }
}

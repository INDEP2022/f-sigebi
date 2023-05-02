import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISubcategory } from '../../models/catalogs/sub-category.model';
@Injectable({
  providedIn: 'root',
})
export class SubcategoryService implements ICrudMethods<ISubcategory> {
  private readonly route: string = ENDPOINT_LINKS.Subcategory;
  constructor(private subcategoryRepository: Repository<ISubcategory>) {}

  getAll(params?: ListParams): Observable<IListResponse<ISubcategory>> {
    return this.subcategoryRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ISubcategory> {
    return this.subcategoryRepository.getById(this.route, id);
  }

  create(model: ISubcategory): Observable<ISubcategory> {
    return this.subcategoryRepository.create(this.route, model);
  }

  update(id: string | number, model: ISubcategory): Observable<Object> {
    return this.subcategoryRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.subcategoryRepository.remove(this.route, id);
  }
}

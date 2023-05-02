import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NumeraryCategoriesEndpoint } from 'src/app/common/constants/endpoints/numerary-categories-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { INumeraryCategories } from '../../models/catalogs/numerary-categories-model';
@Injectable({
  providedIn: 'root',
})
export class NumeraryCategoriesService
  extends HttpService
  implements ICrudMethods<INumeraryCategories>
{
  private readonly route: string = ENDPOINT_LINKS.NumeraryCategories;
  constructor(
    private numeraryCategoriesRepository: Repository<INumeraryCategories>
  ) {
    super();
    this.microservice = NumeraryCategoriesEndpoint.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<INumeraryCategories>> {
    return this.numeraryCategoriesRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<INumeraryCategories> {
    return this.numeraryCategoriesRepository.getById(this.route, id);
  }

  create(model: INumeraryCategories): Observable<INumeraryCategories> {
    return this.numeraryCategoriesRepository.create(this.route, model);
  }

  update(
    id?: string | number,
    model?: INumeraryCategories
  ): Observable<Object> {
    return this.numeraryCategoriesRepository.update(this.route, id, model);
  }

  remove(id: string | number) {
    const route = `${NumeraryCategoriesEndpoint.NumeraryCategories}/id/${id}`;
    return this.delete(route);
  }
}

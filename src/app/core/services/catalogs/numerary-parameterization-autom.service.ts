import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  ICategorizationAutomNumerary,
  INumeraryParameterization,
} from '../../models/catalogs/numerary-categories-model';

@Injectable({
  providedIn: 'root',
})
export class NumeraryParameterizationAutomService implements ICrudMethods<any> {
  private readonly route: string = ENDPOINT_LINKS.NumeraryCategoriesAutom;
  constructor(
    private categorizationAutomNumerarysRepository: Repository<INumeraryParameterization>,
    private categorizationNumerarysRepository: Repository<ICategorizationAutomNumerary>
  ) {}

  getAll(
    params?: ListParams
  ): Observable<IListResponse<INumeraryParameterization>> {
    return this.categorizationAutomNumerarysRepository.getAllPaginated(
      this.route,
      params
    );
  }
  create(
    model: ICategorizationAutomNumerary
  ): Observable<ICategorizationAutomNumerary> {
    return this.categorizationNumerarysRepository.create(this.route, model);
  }
  update6(model: ICategorizationAutomNumerary): Observable<Object> {
    return this.categorizationNumerarysRepository.update6(this.route, model);
  }

  remove3(model: any): Observable<Object> {
    console.log(model);
    return this.categorizationNumerarysRepository.remove3(this.route, model);
  }
}

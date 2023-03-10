import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IParametersIndicators } from '../../models/catalogs/parameters-indicators.model';

@Injectable({
  providedIn: 'root',
})
export class ParameterIndicatorsService
  extends HttpService
  implements ICrudMethods<IParametersIndicators>
{
  private readonly route: string = ENDPOINT_LINKS.ParametersIndicators;
  constructor(
    private parameterIndicatorsRepository: Repository<IParametersIndicators>
  ) {
    super();
    this.microservice = 'catalog';
  }

  getAll(
    params?: ListParams
  ): Observable<IListResponse<IParametersIndicators>> {
    return this.parameterIndicatorsRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<IParametersIndicators> {
    return this.parameterIndicatorsRepository.getById(this.route, id);
  }

  create(model: IParametersIndicators): Observable<IParametersIndicators> {
    return this.parameterIndicatorsRepository.create(this.route, model);
  }

  update(id: string | number, model: IParametersIndicators) {
    const route = `${ENDPOINT_LINKS.PaymentConcept}`;
    return this.put(route, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.parameterIndicatorsRepository.remove(this.route, id);
  }
}

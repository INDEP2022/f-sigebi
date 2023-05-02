import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IIndicatorsParamenter } from '../../models/catalogs/indicators-parameter.model';

@Injectable({
  providedIn: 'root',
})
export class IndicatorsParameterService
  implements ICrudMethods<IIndicatorsParamenter>
{
  private readonly route: string = ENDPOINT_LINKS.IndicatorsParameter;
  constructor(
    private indicatorsParameterRepository: Repository<IIndicatorsParamenter>
  ) {}

  getAll(
    params?: ListParams
  ): Observable<IListResponse<IIndicatorsParamenter>> {
    return this.indicatorsParameterRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<IIndicatorsParamenter> {
    return this.indicatorsParameterRepository.getById(this.route, id);
  }

  create(model: IIndicatorsParamenter): Observable<IIndicatorsParamenter> {
    return this.indicatorsParameterRepository.create(this.route, model);
  }

  update(
    id: string | number,
    model: IIndicatorsParamenter
  ): Observable<Object> {
    return this.indicatorsParameterRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.indicatorsParameterRepository.remove(this.route, id);
  }
}

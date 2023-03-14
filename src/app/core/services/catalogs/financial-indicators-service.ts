import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IFinancialIndicators } from '../../models/catalogs/financial-indicators-model';
@Injectable({
  providedIn: 'root',
})
export class FinancialIndicatorsService
  implements ICrudMethods<IFinancialIndicators>
{
  private readonly route: string = ENDPOINT_LINKS.FinancialIndicators;
  constructor(
    private financialIndicatorsRepository: Repository<IFinancialIndicators>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IFinancialIndicators>> {
    return this.financialIndicatorsRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<IFinancialIndicators> {
    return this.financialIndicatorsRepository.getById(this.route, id);
  }

  create(model: IFinancialIndicators): Observable<IFinancialIndicators> {
    return this.financialIndicatorsRepository.create(this.route, model);
  }

  update(id: string | number, model: IFinancialIndicators): Observable<Object> {
    console.log(this.route);
    return this.financialIndicatorsRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.financialIndicatorsRepository.remove(this.route, id);
  }
}

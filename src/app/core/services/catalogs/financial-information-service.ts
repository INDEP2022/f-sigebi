import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IFinancialInformation } from '../../models/catalogs/financial-information-model';
@Injectable({
  providedIn: 'root',
})
export class DinamicTablesService
  implements ICrudMethods<IFinancialInformation>
{
  private readonly route: string = ENDPOINT_LINKS.FinancialInformation;
  constructor(
    private financialInformationRepository: Repository<IFinancialInformation>
  ) {}

  getAll(
    params?: ListParams
  ): Observable<IListResponse<IFinancialInformation>> {
    return this.financialInformationRepository.getAllPaginated2(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<IFinancialInformation> {
    return this.financialInformationRepository.getById2(this.route, id);
  }

  create(model: IFinancialInformation): Observable<IFinancialInformation> {
    return this.financialInformationRepository.create2(this.route, model);
  }

  update(
    id: string | number,
    model: IFinancialInformation
  ): Observable<Object> {
    return this.financialInformationRepository.update2(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.financialInformationRepository.remove2(this.route, id);
  }
}

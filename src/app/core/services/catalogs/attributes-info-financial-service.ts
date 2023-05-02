import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IAttributesFinancialInfo } from '../../models/catalogs/attributes-financial-info-model';
@Injectable({
  providedIn: 'root',
})
export class AttributesInfoFinancialService
  implements ICrudMethods<IAttributesFinancialInfo>
{
  private readonly route: string = ENDPOINT_LINKS.AttributesFinancialInfo;
  constructor(
    private attributesFinancialInfoRepository: Repository<IAttributesFinancialInfo>
  ) {}

  getAll(
    params?: ListParams
  ): Observable<IListResponse<IAttributesFinancialInfo>> {
    return this.attributesFinancialInfoRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<IAttributesFinancialInfo> {
    return this.attributesFinancialInfoRepository.getById(this.route, id);
  }

  create(
    model: IAttributesFinancialInfo
  ): Observable<IAttributesFinancialInfo> {
    return this.attributesFinancialInfoRepository.create(this.route, model);
  }

  update(
    id: string | number,
    model: IAttributesFinancialInfo
  ): Observable<Object> {
    return this.attributesFinancialInfoRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.attributesFinancialInfoRepository.remove(this.route, id);
  }
}

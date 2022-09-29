import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IThirdPartyCompany } from '../../models/catalogs/third-party-company.model';
@Injectable({
  providedIn: 'root',
})
export class ThirdPartyService implements ICrudMethods<IThirdPartyCompany> {
  private readonly route: string = ENDPOINT_LINKS.ThirdParty;
  constructor(private thirdPartyRepository: Repository<IThirdPartyCompany>) {}

  getAll(params?: ListParams): Observable<IListResponse<IThirdPartyCompany>> {
    return this.thirdPartyRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IThirdPartyCompany> {
    return this.thirdPartyRepository.getById(this.route, id);
  }

  create(model: IThirdPartyCompany): Observable<IThirdPartyCompany> {
    return this.thirdPartyRepository.create(this.route, model);
  }

  update(id: string | number, model: IThirdPartyCompany): Observable<Object> {
    return this.thirdPartyRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.thirdPartyRepository.remove(this.route, id);
  }
}

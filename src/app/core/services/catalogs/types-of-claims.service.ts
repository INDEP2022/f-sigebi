import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ITypeSiniesters } from '../../models/catalogs/types-of-claims.model';
@Injectable({
  providedIn: 'root',
})
export class TypesOfClaimsService {
  private readonly route: string = ENDPOINT_LINKS.TypeSiniesters;
  constructor(private claimsRepository: Repository<ITypeSiniesters>) {}

  getAll(params?: ListParams): Observable<IListResponse<ITypeSiniesters>> {
    return this.claimsRepository.getAllPaginated(this.route, params);
  }

  create(model: ITypeSiniesters): Observable<ITypeSiniesters> {
    return this.claimsRepository.create(this.route, model);
  }

  update(model: ITypeSiniesters): Observable<Object> {
    return this.claimsRepository.newUpdate(this.route, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.claimsRepository.newRemove(this.route, id);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MaintenanceDelegationEndpoints } from 'src/app/common/constants/endpoints/maintenance-delegation-endpoint';
import { SubDelegationEndpoints } from 'src/app/common/constants/endpoints/subdelegation-endpoint';
import { SubDelegationRepository } from 'src/app/common/repository/repositories/subdelegation-repository';
import { HttpService } from 'src/app/common/services/http.service';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISubdelegation } from '../../models/catalogs/subdelegation.model';
@Injectable({
  providedIn: 'root',
})
export class SubDelegationService extends HttpService {
  private readonly route = MaintenanceDelegationEndpoints;
  constructor(
    private subDelegationRepository: SubDelegationRepository<ISubdelegation>
  ) {
    super();
    this.microservice = SubDelegationEndpoints.BasePath;
  }

  getById(
    id: string | number,
    params?: ListParams
  ): Observable<IListResponse<ISubdelegation>> {
    return this.subDelegationRepository.getById(
      `catalog/api/v1/${this.route.SubDelegation}`,
      id
    );
  }

  create(model: ISubdelegation): Observable<ISubdelegation> {
    return this.subDelegationRepository.create(this.route.SubDelegation, model);
  }

  update(id: string | number, model: ISubdelegation): Observable<Object> {
    return this.subDelegationRepository.update(
      this.route.SubDelegation,
      id,
      model
    );
  }

  remove(model: Object) {
    const route = `${SubDelegationEndpoints.SubDelegation}`;
    return this.delete(route, model);
  }
}

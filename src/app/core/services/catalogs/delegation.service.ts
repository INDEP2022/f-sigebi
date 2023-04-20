import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DelegationsEndpoints } from 'src/app/common/constants/endpoints/delegation-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDelegation } from '../../models/catalogs/delegation.model';
import { IStateOfRepublic } from '../../models/catalogs/state-of-republic.model';
import { IZoneGeographic } from '../../models/catalogs/zone-geographic.model';

@Injectable({
  providedIn: 'root',
})
export class DelegationService
  extends HttpService
  implements ICrudMethods<IDelegation>
{
  private readonly route: string = ENDPOINT_LINKS.Delegation;
  private readonly statesRoute = ENDPOINT_LINKS.StateOfRepublic;
  private readonly zonesRoute = ENDPOINT_LINKS.ZoneGeographic;
  constructor(
    private delegationRepository: Repository<IDelegation>,

    private statesRepository: Repository<IStateOfRepublic>,
    private zonesRepository: Repository<IZoneGeographic>
  ) {
    super();
    this.microservice = DelegationsEndpoints.BasePage;
  }

  getAll(params?: ListParams): Observable<IListResponse<IDelegation>> {
    return this.delegationRepository.getAllPaginated(this.route, params);
  }

  getAllModal(self?: DelegationService, params?: ListParams) {
    return self.getAll(params);
  }

  getAllFilterSelf(self?: DelegationService, params?: _Params) {
    return self.get<IListResponse<IDelegation>>('delegation', params);
  }

  getById(id: string | number): Observable<IDelegation> {
    return this.delegationRepository.getById(this.route, id);
  }

  create(model: IDelegation): Observable<IDelegation> {
    return this.delegationRepository.create(this.route, model);
  }

  update(id: string | number, model: IDelegation): Observable<Object> {
    return this.delegationRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.delegationRepository.remove(this.route, id);
  }

  getStates(params: ListParams) {
    return this.statesRepository.getAllPaginated(this.statesRoute, params);
  }

  getZones(params: ListParams) {
    return this.zonesRepository.getAllPaginated(this.zonesRoute, params);
  }

  getAllFiltered(params: _Params) {
    return this.get<IListResponse<IDelegation>>('delegation', params);
  }

  getAll2(
    params?: ListParams | string
  ): Observable<IListResponse<IDelegation>> {
    return this.get<IListResponse<IDelegation>>(
      DelegationsEndpoints.Delegation,
      params
    );
  }

  create2(model: IDelegation) {
    return this.post(DelegationsEndpoints.Delegation, model);
  }

  update2(model: IDelegation) {
    const route = `${DelegationsEndpoints.Delegation}`;
    return this.put(route, model);
  }

  remove2(id: string | number, etapaEdo: string | number) {
    const route = `${DelegationsEndpoints.Delegation}/id/${id}/etapaEdo/${etapaEdo}`;
    return this.delete(route);
  }
}

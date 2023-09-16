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
    private delegationRepository: Repository<any>,

    private statesRepository: Repository<IStateOfRepublic>,
    private zonesRepository: Repository<IZoneGeographic>
  ) {
    super();
    this.microservice = DelegationsEndpoints.BasePage;
  }

  getAll(params?: ListParams | string): Observable<IListResponse<any>> {
    return this.delegationRepository.getAll(this.route, params);
  }

  getAllTwo(params?: ListParams | string) {
    return this.get(this.route, params);
  }

  getAllPaginated(params?: ListParams): Observable<IListResponse<IDelegation>> {
    return this.delegationRepository.getAllPaginated(this.route, params);
  }

  getAppsAll(): Observable<IListResponse<IDelegation>> {
    return this.get<
      IListResponse<{ delegationId: string; description: string }>
    >('apps/getDelegations');
  }

  getAllModal(self?: DelegationService, params?: ListParams) {
    return self.getAll(params);
  }

  getAllFilterSelf(self?: DelegationService, params?: _Params) {
    return self.get<IListResponse<IDelegation>>('delegation', params);
  }

  getFiltered(params: string) {
    return this.get('delegation', params);
  }

  getById(id: string | number): Observable<IDelegation> {
    return this.delegationRepository.newGetById(this.route, id);
  }

  getByIdEtapaEdo(
    id: string | number,
    etapaEdo: string
  ): Observable<IDelegation> {
    const route = `${DelegationsEndpoints.Delegation}/id/${id}/etapaEdo/${etapaEdo}`;
    return this.get(route);
  }

  create(model: IDelegation): Observable<IDelegation> {
    return this.delegationRepository.create(this.route, model);
  }

  update(id: string | number, model: IDelegation): Observable<Object> {
    return this.delegationRepository.updateCatagaloDelegations(
      this.route,
      id,
      model
    );
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
  getAll3(
    params?: ListParams | string
  ): Observable<IListResponse<IDelegation>> {
    return this.get<IListResponse<IDelegation>>(
      DelegationsEndpoints.DelegationAll,
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

  postCatalog(model: any) {
    return this.post(DelegationsEndpoints.catalogetNoActa, model);
  }

  getTran(file: number) {
    return this.get(`${DelegationsEndpoints.tranEmi}/${file}`);
  }
}

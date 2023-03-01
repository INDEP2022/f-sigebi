import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
export class DelegationService implements ICrudMethods<IDelegation> {
  private readonly route: string = ENDPOINT_LINKS.Delegation;
  private readonly statesRoute = ENDPOINT_LINKS.StateOfRepublic;
  private readonly zonesRoute = ENDPOINT_LINKS.ZoneGeographic;
  constructor(
    private delegationRepository: Repository<IDelegation>,
    private statesRepository: Repository<IStateOfRepublic>,
    private zonesRepository: Repository<IZoneGeographic>
  ) {}

  getAll(params?: any): Observable<IListResponse<IDelegation>> {
    return this.delegationRepository.getAllPaginated(this.route, params);
  }

  getAllModal(self?: DelegationService, params?: ListParams | string) {
    return self.getAll(params);
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
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISegProfile } from '../../models/catalogs/profile-maintenance.model';
import { ISegProfileXPant } from '../../models/catalogs/profile-traking-x-pant';

@Injectable({
  providedIn: 'root',
})
export class ProfileMaintenanceService implements ICrudMethods<ISegProfile> {
  private readonly route: string = ENDPOINT_LINKS.security;
  private readonly route1: string = ENDPOINT_LINKS.profileXPant;
  constructor(
    private profileMaintenanceRepository: Repository<ISegProfile>,
    private profileTrakingProfileXPant: Repository<ISegProfileXPant>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<ISegProfile>> {
    return this.profileMaintenanceRepository.getAllPaginated(
      this.route,
      params
    );
  }

  create(model: ISegProfile): Observable<ISegProfile> {
    return this.profileMaintenanceRepository.create(this.route, model);
  }

  newUpdate(model: ISegProfile): Observable<Object> {
    return this.profileMaintenanceRepository.newUpdate(this.route, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.profileMaintenanceRepository.remove(this.route, id);
  }

  getAllProfileXPant(
    params?: ListParams
  ): Observable<IListResponse<ISegProfileXPant>> {
    return this.profileTrakingProfileXPant.getAllPaginated(this.route1, params);
  }

  create1(model: ISegProfileXPant): Observable<ISegProfileXPant> {
    return this.profileTrakingProfileXPant.create(this.route1, model);
  }

  newUpdate1(model: ISegProfileXPant): Observable<Object> {
    return this.profileTrakingProfileXPant.newUpdate(this.route1, model);
  }

  remove1(body: any): Observable<Object> {
    return this.profileTrakingProfileXPant.remove3(this.route1, body);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISegProfile } from '../../models/catalogs/profile-maintenance.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileMaintenanceService implements ICrudMethods<ISegProfile> {
  private readonly route: string = ENDPOINT_LINKS.security;
  constructor(private profileMaintenanceRepository: Repository<ISegProfile>) {}

  getAll(params?: ListParams): Observable<IListResponse<ISegProfile>> {
    return this.profileMaintenanceRepository.getAllPaginated(
      this.route,
      params
    );
  }
}

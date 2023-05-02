import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IZoneContract } from '../../models/catalogs/zone-contract.model';
@Injectable({
  providedIn: 'root',
})
export class ZoneContractService implements ICrudMethods<IZoneContract> {
  private readonly route: string = ENDPOINT_LINKS.ZoneContract;
  constructor(private zoneContractRepository: Repository<IZoneContract>) {}

  getAll(params?: ListParams): Observable<IListResponse<IZoneContract>> {
    return this.zoneContractRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IZoneContract> {
    return this.zoneContractRepository.getById(this.route, id);
  }

  create(model: IZoneContract): Observable<IZoneContract> {
    return this.zoneContractRepository.create(this.route, model);
  }

  update(id: string | number, model: IZoneContract): Observable<Object> {
    return this.zoneContractRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.zoneContractRepository.remove(this.route, id);
  }
}

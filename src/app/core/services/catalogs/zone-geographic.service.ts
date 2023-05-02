import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IZoneGeographic } from '../../models/catalogs/zone-geographic.model';
@Injectable({
  providedIn: 'root',
})
export class ZoneGeographicService implements ICrudMethods<IZoneGeographic> {
  private readonly route: string = ENDPOINT_LINKS.ZoneGeographic;
  constructor(private zoneGeographicRepository: Repository<IZoneGeographic>) {}

  getAll(params?: ListParams): Observable<IListResponse<IZoneGeographic>> {
    return this.zoneGeographicRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IZoneGeographic> {
    return this.zoneGeographicRepository.getById(this.route, id);
  }

  create(model: IZoneGeographic): Observable<IZoneGeographic> {
    return this.zoneGeographicRepository.create(this.route, model);
  }

  update(id: string | number, model: IZoneGeographic): Observable<Object> {
    return this.zoneGeographicRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.zoneGeographicRepository.remove(this.route, id);
  }
}

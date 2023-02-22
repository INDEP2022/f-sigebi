import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStation } from '../../models/catalogs/station.model';
@Injectable({
  providedIn: 'root',
})
export class StationService implements ICrudMethods<IStation> {
  private readonly route: string = ENDPOINT_LINKS.Station;
  constructor(private stationRepository: Repository<IStation>) {}

  getAll(params?: ListParams): Observable<IListResponse<IStation>> {
    return this.stationRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IStation> {
    return this.stationRepository.getById(this.route, id);
  }

  create(model: IStation): Observable<IStation> {
    return this.stationRepository.create(this.route, model);
  }

  update(id: string | number, model: IStation): Observable<Object> {
    return this.stationRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.stationRepository.remove(this.route, id);
  }
}

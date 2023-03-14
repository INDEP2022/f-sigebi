import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Station } from 'src/app/common/constants/endpoints/station-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStation, IStation2 } from '../../models/catalogs/station.model';
@Injectable({
  providedIn: 'root',
})
export class StationService
  extends HttpService
  implements ICrudMethods<IStation>
{
  private readonly route: string = ENDPOINT_LINKS.Station;
  constructor(private stationRepository: Repository<IStation>) {
    super();
    this.microservice = 'catalog';
  }

  getAll(params?: ListParams): Observable<IListResponse<IStation>> {
    return this.stationRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IStation> {
    return this.stationRepository.getById(`${this.route}/id`, id);
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

  getAllFilter(params?: _Params) {
    return this.get('station', params);
  }

  search(params: ListParams) {
    var route = 'station/search';
    return this.get(route, params);
  }

  getStationByTransferent(
    id: string | number,
    params?: ListParams
  ): Observable<IListResponse<IStation2>> {
    const route = `${Station.Station}?filter.idTransferent=${id}`;
    return this.get(route);
  }
}

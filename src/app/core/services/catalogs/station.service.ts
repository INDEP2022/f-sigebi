import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Station } from 'src/app/common/constants/endpoints/station-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IStation,
  IStation2,
  IStation3,
} from '../../models/catalogs/station.model';
import { ITransferente } from '../../models/catalogs/transferente.model';
@Injectable({
  providedIn: 'root',
})
export class StationService
  extends HttpService
  implements ICrudMethods<IStation>
{
  private readonly route: string = ENDPOINT_LINKS.Station;
  private readonly transferRoute: string = ENDPOINT_LINKS.Transferente;
  constructor(
    private stationRepository: Repository<IStation>,
    private transferenteRepository: Repository<ITransferente>
  ) {
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
    return this.stationRepository.remove2(this.route, id);
  }

  remove5(id: string | number, idTrans: number): Observable<Object> {
    return this.stationRepository.remove5(this.route, id, idTrans);
  }

  remove3(model: IStation3): Observable<Object> {
    return this.stationRepository.remove3(this.route, model);
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
    return this.get(route, params);
  }

  getTransfers(params?: ListParams): Observable<IListResponse<ITransferente>> {
    return this.transferenteRepository.getAllPaginated(
      this.transferRoute,
      params
    );
  }
}

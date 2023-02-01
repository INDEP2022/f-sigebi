import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IMinpub } from '../../models/catalogs/minpub.model';
import { Minpub } from '../../models/parameterization/parametrization.model';
@Injectable({
  providedIn: 'root',
})
export class MinPubService implements ICrudMethods<IMinpub> {
  private readonly route: string = ENDPOINT_LINKS.MinPub;
  private readonly cityRoute: string = ENDPOINT_LINKS.City;
  constructor(
    private minPubRepository: Repository<IMinpub>,
    private cityRepository: Repository<ICity>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IMinpub>> {
    return this.minPubRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IMinpub> {
    return this.minPubRepository.getById(this.route, id);
  }

  create(model: IMinpub | Minpub): Observable<IMinpub> {
    return this.minPubRepository.create(this.route, model);
  }

  update(id: string | number, model: IMinpub): Observable<Object> {
    return this.minPubRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.minPubRepository.remove(this.route, id);
  }

  getCities(params?: ListParams): Observable<IListResponse<ICity>> {
    return this.cityRepository.getAllPaginated(this.cityRoute, params);
  }
}

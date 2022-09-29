import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { ICity } from '../models/city.model';
@Injectable({
  providedIn: 'root',
})
export class CityService implements ICrudMethods<ICity> {
  private readonly route: string = ENDPOINT_LINKS.City;
  constructor(private cityRepository: Repository<ICity>) {}

  getAll(params?: ListParams): Observable<IListResponse<ICity>> {
    return this.cityRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ICity> {
    return this.cityRepository.getById(this.route, id);
  }

  create(model: ICity): Observable<ICity> {
    return this.cityRepository.create(this.route, model);
  }

  update(id: string | number, model: ICity): Observable<Object> {
    return this.cityRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.cityRepository.remove(this.route, id);
  }
}

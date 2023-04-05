import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CityEndpoints } from 'src/app/common/constants/endpoints/city-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ICity } from '../../models/catalogs/city.model';
@Injectable({
  providedIn: 'root',
})
export class CityService extends HttpService implements ICrudMethods<ICity> {
  private readonly route: string = ENDPOINT_LINKS.City;
  constructor(private cityRepository: Repository<ICity>) {
    super();
    this.microservice = CityEndpoints.BasePage;
  }

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

  create2(model: ICity) {
    return this.post(CityEndpoints.City, model);
  }

  update2(id: string | number, model: ICity): Observable<Object> {
    const route = `${CityEndpoints.City}/id/${id}`;
    return this.put(route, model);
  }

  remove2(id: string | number): Observable<Object> {
    const route = `${CityEndpoints.City}/id/${id}`;
    return this.delete(route);
  }

  getAllFiltered(params: string): Observable<IListResponse<ICity>> {
    return this.get<IListResponse<ICity>>(CityEndpoints.City, params);
  }
}

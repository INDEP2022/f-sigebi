import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CityEndpoints } from 'src/app/common/constants/endpoints/city-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
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
  private readonly router: string = ENDPOINT_LINKS.CityAll;
  constructor(private cityRepository: Repository<ICity>) {
    super();
    this.microservice = CityEndpoints.BasePage;
  }

  getAll(params?: ListParams): Observable<IListResponse<ICity>> {
    return this.cityRepository.getAllPaginated(this.route, params);
  }
  getAllCitys(params?: ListParams): Observable<IListResponse<ICity>> {
    return this.cityRepository.getAllPaginated(this.route + '/get-all', params);
  }

  getAllCitysTwo(params?: _Params) {
    return this.get(this.router, params);
  }

  getId(id: string | number) {
    return this.get(this.router + `/id/${id}`);
  }

  getById(id: string | number): Observable<ICity> {
    return this.cityRepository.getById(this.route + '/id/', id);
  }

  newGetById(id: string | number): Observable<ICity> {
    return this.cityRepository.getById(this.route + '/id', id);
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

  getAllByCity(
    city?: any,
    params?: ListParams
  ): Observable<IListResponse<ICity>> {
    const route = `${ENDPOINT_LINKS.City}${city}`;
    return this.cityRepository.getAllPaginated(route, params);
  }

  getCityQuery(city: any) {
    const route = `${CityEndpoints.City}?filter.nameCity=$ilike:${city}`;
    return this.get(route);
  }

  getCityQueryByid(city: any) {
    const route = `${CityEndpoints.City}?filter.idCity=$eq:${city}`;
    return this.get(route);
  }
}

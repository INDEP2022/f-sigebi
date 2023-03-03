import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';
import { ParameterComerEndpoints } from '../../../common/constants/endpoints/ms-parametercomer-endpoints';
import { ITiieV1 } from '../../models/ms-parametercomer/parameter';

@Injectable({
  providedIn: 'root',
})
export class ParameterTiieService extends HttpService {
  private readonly endpoint: string = ParameterComerEndpoints.Tiie;
  constructor(private htpp: HttpClient) {
    super();
    this.microservice = ParameterComerEndpoints.BasePath;
  }

  getTiie() {
    const url = `${environment.API_URL}parametercomer/api/v1/comer-cat-tiie`;
    return this.htpp.get(url);
  }

  getAll(params?: ListParams): Observable<IListResponse<ITiieV1>> {
    return this.get<IListResponse<ITiieV1>>(this.endpoint, params);
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.get(route);
  }

  create(tiie: ITiieV1) {
    return this.post(this.endpoint, tiie);
  }

  update(id: string | number, tiie: ITiieV1) {
    const route = `${this.endpoint}/${id}`;
    return this.put(route, tiie);
  }

  remove(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.delete(route);
  }
}

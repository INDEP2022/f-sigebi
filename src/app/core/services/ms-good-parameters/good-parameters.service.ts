import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodParameter } from '../../models/ms-good-parameter/good-parameter.model';

@Injectable({
  providedIn: 'root',
})
export class GoodParametersService extends HttpService {
  constructor() {
    super();
    this.microservice = 'parametergood';
  }

  getPhaseEdo(): Observable<{ stagecreated: number }> {
    const today = new Date().toISOString();
    const params = { date: today };
    return this.get('parameters/fa-stage-creda', params);
  }

  getById(parameter: string) {
    return this.get<IGoodParameter>(`parameters/${parameter}`);
  }

  createAccount(movement: any) {
    return this.post('parameters/getFromRates', movement);
  }

  getRNomencla(params: ListParams) {
    return this.get<IListResponse>('r-nomencla', params);
  }

  getAll(params: ListParams) {
    return this.get<IListResponse<IGoodParameter>>(`parameters`, params);
  }
}

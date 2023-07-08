import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { MenageEndpoints } from 'src/app/common/constants/endpoints/ms-menage';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';

import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IMenageDescription,
  IMenageWrite,
} from '../../models/ms-menage/menage.model';

@Injectable({
  providedIn: 'root',
})
export class MenageService extends HttpService {
  constructor() {
    super();
    this.microservice = MenageEndpoints.Menage;
  }

  create(menage: IMenageWrite) {
    return this.post(MenageEndpoints.MenageManagement, menage);
  }

  getAll(params?: ListParams): Observable<IListResponse<IMenageWrite>> {
    const route = MenageEndpoints.MenageManagement;
    return this.get<IListResponse<IMenageWrite>>(route, params);
  }

  getById(id: string | number) {
    const route = `${MenageEndpoints.MenageManagement}/${id}`;
    return this.get<IListResponse<IMenageWrite>>(route);
  }

  update(id: string | number, good: IMenageWrite) {
    const route = `${MenageEndpoints.MenageManagement}/${id}`;
    return this.put(route, good);
  }

  //http://sigebimsqa.indep.gob.mx/menage/api/v1/gestion-menaje/73096
  remove(id: string | number) {
    const route = `${MenageEndpoints.MenageManagement}/${id}`;
    console.log(route);
    return this.delete(route);
  }

  //http://sigebimsqa.indep.gob.mx/menage/api/v1/gestion-menaje?filter.noGood=$eq:18596
  getByGood(id: string | number, params?: ListParams) {
    console.log(id, params);
    const route = `${MenageEndpoints.MenageManagement}?filter.noGood=$eq:${id}`;
    return this.get<IListResponse<IMenageDescription>>(route, params);
  }

  getMenaje(params?: any) {
    const route = `${MenageEndpoints.MenageManagement}`;
    return this.get<any>(route, params);
  }
}

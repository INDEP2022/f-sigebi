import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { environment } from 'src/environments/environment';
import { GoodEndpoints } from '../../../common/constants/endpoints/ms-good-endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDepartment } from '../../models/catalogs/department.model';
import { ISegUsers } from '../../models/ms-users/seg-users-model';

@Injectable({
  providedIn: 'root',
})
/**
 * @deprecated Implementar el repositorio cuando se tenga listo
 */
export class UsersService {
  private readonly route = GoodEndpoints;

  constructor(private httpClient: HttpClient) {}

  getAllSegUsers(params: ListParams) {
    return this.httpClient.get<IListResponse<any>>(
      `${environment.API_URL}users/api/v1/seg-users`,
      { params }
    );
  }

  getAllSegXAreas(params: ListParams) {
    return this.httpClient.get<IListResponse<any>>(
      `${environment.API_URL}users/api/v1/seg-access-x-areas`,
      { params }
    );
  }

  getAllSegXAreasFind(params: ListParams) {
    return this.httpClient.get<IListResponse<any>>(
      `${environment.API_URL}users/api/v1/seg-access-x-areas/find-all-registers-users-access-by-areas-and-delegatons`,
      { params }
    );
  }

  create(segUsers: ISegUsers) {
    const route = `${environment.API_URL}users/api/v1/seg-users`;
    return this.httpClient.post(route, segUsers);
  }

  update(segUsers: ISegUsers) {
    const route = `${environment.API_URL}users/api/v1/seg-users`;
    return this.httpClient.put(route, segUsers);
  }

  /**
   *
   * @deprecated Cambiar a department service cuando este arreglado
   */
  getDepartmentByIds(body: any) {
    return this.httpClient.post<IDepartment>(
      `${environment.API_URL}/catalog/api/v1/departament/id`,
      body
    );
  }
}

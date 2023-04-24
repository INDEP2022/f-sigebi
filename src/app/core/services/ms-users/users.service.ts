import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserEndpoints } from 'src/app/common/constants/endpoints/ms-users-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDepartment } from '../../models/catalogs/department.model';
import { IUserAccessAreaRelational } from '../../models/ms-users/seg-access-area-relational.model';
import { ISegUsers } from '../../models/ms-users/seg-users-model';
import { IUserAccess } from '../../models/ms-users/user-access';

@Injectable({
  providedIn: 'root',
})
/**
 * @deprecated Implementar el repositorio cuando se tenga listo
 */
export class UsersService extends HttpService {
  constructor(protected override httpClient: HttpClient) {
    super();
    this.microservice = UserEndpoints.BasePath;
  }

  getAllSegUsers(_params: _Params) {
    return this.get<IListResponse<any>>(UserEndpoints.SegUsers, _params);
  }

  getAllSegUsersModal(self?: UsersService, _params?: ListParams | string) {
    return self.get<IListResponse<any>>(UserEndpoints.SegUsers, _params);
  }

  getAllSegXAreas(params: ListParams) {
    return this.get<IListResponse<any>>(UserEndpoints.SegAccessAreas, params);
  }

  //TODO: HOMOLOGAR SERVICIOS getAllSegXAreas()
  getAllSegXAreasByParams(_params: _Params) {
    return this.get<IListResponse<any>>(UserEndpoints.SegAccessAreas, _params);
  }

  getAllSegXAreasFind(params: ListParams) {
    return this.get<IListResponse<any>>(
      `${UserEndpoints.SegAccessAreas}/find-all-registers-users-access-by-areas-and-delegatons`,
      params
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

  getEmailIndep(
    params?: ListParams | string
  ): Observable<IListResponse<ISegUsers>> {
    return this.get<IListResponse<ISegUsers>>(
      `${UserEndpoints.SegUsers}?filter.email=$ilike:@indep.gob.mx`,
      params
    );
  }

  getInfoUserLogued(
    params?: string
  ): Observable<IListResponse<IUserAccessAreaRelational>> {
    this.microservice = UserEndpoints.BasePath;
    return this.get<IListResponse<IUserAccessAreaRelational>>(
      UserEndpoints.SegAccessAreas,
      params
    );
  }

  getAccessUsers(_params: _Params) {
    return this.get<IListResponse<IUserAccess>>(
      UserEndpoints.VigSupervisionAccess,
      _params
    );
  }
}

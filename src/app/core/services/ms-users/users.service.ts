import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
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

  //http://sigebimsqa.indep.gob.mx/users/api/v1/seg-users
  getAllSegUsers(_params?: _Params) {
    return this.get<IListResponse<any>>(UserEndpoints.SegUsers, _params);
  }

  getAllSegUsers2(_params: _Params) {
    return this.get<IListResponse<any>>(UserEndpoints.GetAllSegUser, _params);
  }

  getAllDetailSegUsers(_params: _Params) {
    const route = `${UserEndpoints.SegUsers}/get-all`;
    return this.get<IListResponse<any>>(route, _params);
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

  getUsersJob() {
    return this.get(UserEndpoints.SegUsers);
  }

  getText(text: string) {
    return this.get(`${UserEndpoints.GetText}/${text}`);
  }
  getUserOt(text: string) {
    return this.get(`${UserEndpoints.GetUserOt}/${text}`);
  }

  getAllUsersAsigne(_params: _Params) {
    return this.get<IListResponse<any>>(UserEndpoints.UserAsigne, _params);
  }

  postSegAccessXAreasTvalTabla1(body: {
    delegacionNo: string | number;
    user: string;
  }) {
    return this.post(`factadboficiogestrel/delete-when-button-pressed`, body);
  }

  getAllIndicator(body: any) {
    return this.post<IListResponse<any>>(UserEndpoints.IndUserNoInd, body);
  }

  getAllFaVal(body: any) {
    return this.post<IListResponse<any>>(UserEndpoints.FaValUserInd, body);
  }

  deleteAccessUsers(id: any) {
    return this.delete<IListResponse<IUserAccess>>(
      `${UserEndpoints.VigSupervisionAccess}/${id}`
    );
  }

  editAccessUsers(body: any) {
    return this.put<IListResponse<IUserAccess>>(
      UserEndpoints.VigSupervisionAccess,
      body
    );
  }

  createAccessUsers(body: any) {
    return this.post<IListResponse<IUserAccess>>(
      UserEndpoints.VigSupervisionAccess,
      body
    );
  }

  getComerUsersAutXEvent(_params?: _Params) {
    return this.get<IListResponse<any>>(
      UserEndpoints.ComerUsersAutXEvent,
      _params
    );
  }

  createComerUsersAutXEvent(params: any) {
    return this.post<IListResponse<any>>(
      UserEndpoints.ComerUsersAutXEvent,
      params
    );
  }

  updateComerUsersAutXEvent(params: any) {
    return this.put<IListResponse<any>>(
      `${UserEndpoints.ComerUsersAutXEvent}`,
      params
    );
  }

  deleteComerUsersAutXEvent(params: any) {
    return this.delete<IListResponse<any>>(
      `${UserEndpoints.ComerUsersAutXEvent}`,
      params
    );
  }

  /*
 getUsersJob() {
    return this.get<IListResponse<ISegUsers>>(UserEndpoints.SegUsers);
  }
*/

  getOtValueFromUserName(name: string) {
    return this.get<IListResponse<any>>(
      UserEndpoints.SegUsers + '/getOtValueFromUser/' + name
    );
  }
  postSpInsertWithcopyOfficia(body: any) {
    return this.post<IListResponse<any>>(
      UserEndpoints.SpInsertWithcopyOfficial,
      body
    );
  }

  getAllSegUsersbykey(user: any) {
    return this.get(
      `${UserEndpoints.GetAllSegUser}?filter.user=$ilike:${user}`
    );
  }

  getComerUserXCan(params: _Params) {
    return this.get(UserEndpoints.ComerUser, params);
  }

  getUsersbyUSer(user: any) {
    return this.get(`${UserEndpoints.SegUsers}?filter.id=$eq:${user}`);
  }

  getAllSegUsers3(_params: _Params, name: any) {
    return this.get<IListResponse<any>>(
      `${UserEndpoints.GetAllSegUser}?filter.name=$ilike:${name}`,
      _params
    );
  }

  getGetRecDeleg(body: any, params: ListParams) {
    return this.post<IListResponse<any>>(UserEndpoints.RecDeleg, body, params);
  }

  getGetRecSubDel(noDel: string | number, params: ListParams) {
    return this.get<IListResponse<any>>(
      `${UserEndpoints.RecSubDel}/${noDel}`,
      params
    );
  }

  getRecVault(body: any, params: ListParams) {
    return this.post<IListResponse<any>>(UserEndpoints.RecVault, body, params);
  }
  getUsersbyUsers(user: any) {
    return this.get(`${UserEndpoints.SegUsers}?filter.id=$eq:${user}`);
  }

  getAllSegUsers4(name: any) {
    return this.get<IListResponse<any>>(
      `${UserEndpoints.GetAllSegUser}?filter.user=$ilike:${name}`
    );
  }

  getBtnViewPrev(no_ofice: any) {
    const route = `${UserEndpoints.viewPrev}/${no_ofice}`;
    return this.get(route);
  }

  getUseXEvent(params: _Params) {
    return this.get('comer-usersautxcanc', params);
  }

  consultationQuery1(no_acta: any, params: ListParams) {
    const route = `${UserEndpoints.consultationQuery1}/${no_acta}`;
    return this.get<IListResponse>(route, params);
  }

  consultationQuery2(params: ListParams) {
    return this.get<IListResponse>(UserEndpoints.consultationQuery2, params);
  }
  getOffice(proceso: number, folio: number) {
    const route = `${UserEndpoints.getOffice}/${proceso}/${folio}`;
    return this.get<IListResponse>(route);
  }

  getCantUsusAutxCanc(user: string) {
    return this.get<{ data: { count: number }[] }>(
      'application/value-user/' + user.toUpperCase()
    ).pipe(
      catchError(x => of({ data: [{ count: 0 }] })),
      map(x => {
        return x.data[0].count;
      })
    );
  }

  getApplicationPhysicalNonexistence(id: string | number, params: _Params) {
    const route = `${UserEndpoints.ApplicationPhysicalNonexistence}/${id}/`;
    return this.get<IListResponse>(route, params);
  }
}

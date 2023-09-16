import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityEndpoints } from 'src/app/common/constants/endpoints/ms-security-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import {
  IListResponse,
  IListResponseMessage,
} from '../../interfaces/list-response.interface';
import {
  IAccesTrackingXArea,
  IPupUser,
  ITrackingAcces,
  Iuser,
  IUsersTracking,
} from '../../models/ms-security/pup-user.model';

@Injectable({
  providedIn: 'root',
})
export class SecurityService extends HttpService {
  private endpoint = SecurityEndpoints.GenerateIdentifier;
  private screen = '?.filter.screenKey=$eq:';
  private userName = '&filter.user=$eq:';
  private uName = '?filter.user=$eq:';
  constructor() {
    super();
    this.microservice = SecurityEndpoints.Security;
  }

  pupUser(user: string) {
    const route = `security/pup-user/${user}`;
    return this.get<IListResponse<IPupUser>>(route);
  }

  getAllUsersTracker(
    params?: _Params
  ): Observable<IListResponse<IUsersTracking>> {
    return this.get<IListResponse<IUsersTracking>>(
      SecurityEndpoints.UsersTracking,
      params
    );
  }

  getAllUsersAccessTracking(
    params?: _Params
  ): Observable<IListResponse<IAccesTrackingXArea>> {
    return this.get<IListResponse<IAccesTrackingXArea>>(
      SecurityEndpoints.AccessTrackingXArea,
      params
    );
  }

  getAllUser(params?: _Params): Observable<IListResponse<Iuser>> {
    return this.get<IListResponse<Iuser>>(SecurityEndpoints.User, params);
  }

  getAllFilterAssigned(params: any) {
    return this.get<IListResponse<IAccesTrackingXArea>>(
      `access-tracking-x-area`,
      params
    );
  }

  lovCitiesRegCity(body: any, params: _Params) {
    return this.post(
      `${SecurityEndpoints.AplicationLovCitiesRegCity}`,
      body,
      params
    );
  }

  getAccessXScreenFilter(params?: any) {
    return this.get(`tracking-access-screens`, params);
  }

  getFilterAllUsersTrackerV2(params: ListParams) {
    return this.get<IListResponse<any>>(`access-tracking-x-area`, params);
  }

  getFilterAllUsersTracker(params: any) {
    return this.get<IListResponse<any>>(`access-tracking-x-area`, params);
  }

  getStationClue(params: any) {
    return this.get<IListResponse<any>>(
      `${SecurityEndpoints.StationClue}/${params}`
    );
  }

  getIdDelegationDelegationForwards(params: any) {
    return this.get<IListResponse<any>>(
      `${SecurityEndpoints.IdDelegationDelegationForwards}/${params}`
    );
  }
  getIdDelegationDelegationAddressee(params: any) {
    return this.get<IListResponse<any>>(
      `${SecurityEndpoints.IdDelegationDelegationAddressee}/${params}`
    );
  }
  getQueryIdenti(params: any) {
    return this.post<IListResponse<any>>(
      `${SecurityEndpoints.QueryIdenti}`,
      params
    );
  }
  getScreenUser(screen: string, user: string) {
    const route = `${this.endpoint}${this.screen}${screen}${this.userName}${user}`;
    return this.get(route);
  }

  getScreenWidthParams(params: _Params) {
    return this.get<IListResponseMessage<ITrackingAcces>>(
      this.endpoint,
      params
    );
  }
  getSegEmailUser(body: any) {
    const route = SecurityEndpoints.SegEmailUser;
    return this.post(route, body);
  }

  getSegCopyEmailUser(body: any) {
    const route = SecurityEndpoints.SegCopyEmail;
    return this.post(route, body);
  }

  getFaCoordAdmin(body: any) {
    const route = SecurityEndpoints.FaCoordAdmin;
    return this.post(route, body);
  }
  getFaDelResponsable(id: any) {
    const route = SecurityEndpoints.FaDelResponsable;
    return this.get(`${route}?noBien=${id}`);
  }

  getIniEmail(data: Object) {
    return this.post(SecurityEndpoints.IniEmail, data);
  }

  getUser(uName: string) {
    return this.get<IListResponse<IUsersTracking>>(
      `${SecurityEndpoints.UsersTracking}${this.uName}${uName}`
    );
  }

  getValidScreens(params: _Params) {
    return this.get<IListResponse<any>>(
      `${SecurityEndpoints.TrackingValidScreens}`
    );
  }

  getViewDelegationUser(user: string, delegation: string) {
    return this.get(
      `${SecurityEndpoints.ApplicationAux}?puser=${user}&pdelega=${delegation}`
    );
  }
}

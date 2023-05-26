import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityEndpoints } from 'src/app/common/constants/endpoints/ms-security-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IAccesTrackingXArea,
  IPupUser,
  IUsersTracking,
} from '../../models/ms-security/pup-user.model';

@Injectable({
  providedIn: 'root',
})
export class SecurityService extends HttpService {
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
  getAllFilterAssigned(params: any) {
    return this.get<IListResponse<IAccesTrackingXArea>>(
      `access-tracking-x-area`,
      params
    );
  }
}

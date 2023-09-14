import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProcessEndpoint } from 'src/app/common/constants/endpoints/ms-user-process-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IUserProcess } from '../../models/ms-user-process/user-process.model';

@Injectable({
  providedIn: 'root',
})
export class UserProcessService extends HttpService {
  constructor() {
    super();
    this.microservice = UserProcessEndpoint.UserProcess;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IUserProcess>> {
    return this.get<IListResponse<IUserProcess>>(
      UserProcessEndpoint.UserList,
      params
    );
  }

  getAllUsersWithRol(
    params?: ListParams | string
  ): Observable<IListResponse<IUserProcess>> {
    return this.get<IListResponse<IUserProcess>>(
      UserProcessEndpoint.UserListWithRol,
      params
    );
  }

  getAllUsersWithRolDistint(
    params?: ListParams
  ): Observable<IListResponse<IUserProcess>> {
    return this.get<IListResponse<IUserProcess>>(
      UserProcessEndpoint.UserListWithRolDistint,
      params
    );
  }

  getAllUsersWithProgramming(
    _params?: ListParams
  ): Observable<IListResponse<IUserProcess>> {
    const params = this.makeParams(_params);
    return this.get<IListResponse<IUserProcess>>(
      `${UserProcessEndpoint.UserListWithRol}?${params}`
    );
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}

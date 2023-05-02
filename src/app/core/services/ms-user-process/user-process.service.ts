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
}

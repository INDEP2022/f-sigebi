import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserEndpoints } from 'src/app/common/constants/endpoints/ms-users-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IUserNameOtval } from '../../models/ms-users/user-access';

@Injectable({
  providedIn: 'root',
})
export class IndUserService extends HttpService {
  constructor() {
    super();
    this.microservice = UserEndpoints.BasePath;
  }

  getMinIndUser(user: string, indicatorNumber: number) {
    return this.post<{ data: { min: string }[] }>('ind-user/noind', {
      user,
      indicatorNumber,
    }).pipe(map(response => response?.data[0]?.min ?? null));
  }
  getAllNameOtval(params?: _Params): Observable<IListResponse<IUserNameOtval>> {
    return this.get(UserEndpoints.NameOtval, params);
  }

  getSegAccessAreas(params: string) {
    return this.get(
      `${UserEndpoints.SegAccessAreas}?filter.user=$eq:${params}`
    );
  }
}

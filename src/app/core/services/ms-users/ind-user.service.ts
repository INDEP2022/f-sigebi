import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { UserEndpoints } from 'src/app/common/constants/endpoints/ms-users-endpoints';
import { HttpService } from 'src/app/common/services/http.service';

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
}

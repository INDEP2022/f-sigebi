import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserEndpoints } from 'src/app/common/constants/endpoints/ms-users-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IUserAccessAreaRelational } from '../../models/ms-users/seg-access-area-relational.model';

@Injectable({
  providedIn: 'root',
})
export class SegAcessXAreasService extends HttpService {
  private readonly route = UserEndpoints;
  constructor() {
    super();
    this.microservice = UserEndpoints.BasePath;
  }

  getAll(
    params?: _Params
  ): Observable<IListResponse<IUserAccessAreaRelational>> {
    return this.get<IListResponse<IUserAccessAreaRelational>>(
      this.route.SegAccessAreas,
      params
    );
  }

  create(body: IUserAccessAreaRelational) {
    return this.post(this.route.SegAccessAreas, body);
  }

  update(body: Partial<IUserAccessAreaRelational>) {
    return this.put(this.route.SegAccessAreas, body);
  }

  remove(body: Partial<IUserAccessAreaRelational>) {
    return this.delete(this.route.SegAccessAreas, body);
  }
}

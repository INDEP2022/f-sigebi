import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserEventsEndpoints } from 'src/app/common/constants/endpoints/user-events';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UserTpeeventsService extends HttpService {
  private readonly route = UserEventsEndpoints;
  constructor() {
    super();
    this.microservice = UserEventsEndpoints.BasePath;
  }
  getAllTypeUser(params?: _Params): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(this.route.UserEvents, params);
  }
  create(body: Partial<any>) {
    return this.post(this.route.UserEvents, body);
  }

  remove(body: Partial<any>) {
    return this.delete(this.route.UserEvents, body);
  }

  getByEventTypeAndUser(body: {
    idTpevent: string | number;
    username: string;
  }) {
    return this.post(`${this.route.UserEvents}/findById`, body);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatusDisp } from 'src/app/common/constants/endpoints/status-disp-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class StatusDispService extends HttpService {
  private readonly route = StatusDisp;
  constructor() {
    super();
    this.microservice = StatusDisp.BasePath;
  }
  getAllTypeUser(params?: _Params): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(this.route.StationDisp, params);
  }
  create(body: Partial<any>) {
    return this.post(this.route.StationDisp, body);
  }
  update(body: Partial<any>) {
    return this.put(this.route.StationDisp, body);
  }
  remove(body: Partial<any>) {
    return this.delete(this.route.StationDisp, body);
  }

  validBidding(params: any) {
    const route = `${StatusDisp.validBidding}`;
    return this.post(route, params);
  }
}

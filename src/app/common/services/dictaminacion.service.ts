import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import {
  IDictamina,
  IUserLevelData,
} from 'src/app/pages/general-processes/indicators/consolidated/consolidated/consolidated-columns';
import { ENDPOINT_LINKS } from '../constants/endpoints';
import { EIndicatorGoodsEndpoints } from '../constants/endpoints/ms-indicatorgoods-endpoint';
import { UserLevelEndpoints } from '../constants/endpoints/userLevel-endpoint';
import { ListParams } from '../repository/interfaces/list-params';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class DictaminacionService extends HttpService {
  private readonly routeGetDictamina: string = ENDPOINT_LINKS.IndicatorGood;
  private readonly msIndicatorGood: string = EIndicatorGoodsEndpoints.BasePath;
  private readonly routeGetUserLevel: string = ENDPOINT_LINKS.UserLevel;
  constructor() {
    super();
    this.microservice = UserLevelEndpoints.UserLevel;
  }

  public paramsToSend = new BehaviorSubject<ListParams>(new ListParams());
  paramsDictamina = this.paramsToSend.asObservable();

  getDictamina(params?: ListParams): Observable<IListResponse<IDictamina>> {
    this.microservice = this.msIndicatorGood;
    return this.get<IListResponse<IDictamina>>(this.routeGetDictamina, params);
  }

  setParamsDictaminacion(data: ListParams) {
    this.paramsToSend.next(data);
  }

  getUserLevel(params: string) {
    const params1 = `toolbar_user=${params}`;
    return this.get<IUserLevelData>(this.routeGetUserLevel, params1);
  }
}

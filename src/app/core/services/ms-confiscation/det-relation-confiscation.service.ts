import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfiscationEndpoints } from 'src/app/common/constants/endpoints/ms-confiscation-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDetRelationConfiscation } from '../../models/ms-confiscation/det-relation-confiscation';
import {
  IMaxNoRelDec,
  IMoreRelationConfiscation,
} from '../../models/ms-confiscation/more-relation-confiscation';

@Injectable({
  providedIn: 'root',
})
export class DetRelationConfiscationService extends HttpService {
  constructor() {
    super();
    this.microservice = ConfiscationEndpoints.Confiscation;
  }

  getAllDetRel(
    params?: _Params
  ): Observable<IListResponse<IDetRelationConfiscation>> {
    return this.get<IListResponse<IDetRelationConfiscation>>(
      ConfiscationEndpoints.DetRelationConfiscation,
      params
    );
  }

  Insert(model?: ListParams): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      ConfiscationEndpoints.filterInsert,
      model
    );
  }

  getAllMore(
    params?: _Params
  ): Observable<IListResponse<IMoreRelationConfiscation>> {
    return this.get<IListResponse<IMoreRelationConfiscation>>(
      ConfiscationEndpoints.MoreRelationConfiscation,
      params
    );
  }

  getAllMaxNoRelDec(year: number | string) {
    const route = `${ConfiscationEndpoints.Application}?year=${year}`;
    return this.get<IListResponse<IMaxNoRelDec>>(route);
  }
}

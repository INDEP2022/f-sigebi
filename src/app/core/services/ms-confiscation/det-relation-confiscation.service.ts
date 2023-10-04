import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfiscationEndpoints } from 'src/app/common/constants/endpoints/ms-confiscation-endpoints';
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

  getByGood(id?: any): Observable<IListResponse<any>> {
    const route = ConfiscationEndpoints.getData;
    return this.get<IListResponse<any>>(route + id);
  }

  Insert(model?: any): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      ConfiscationEndpoints.filterInsert,
      model
    );
  }

  getById(id?: any): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      ConfiscationEndpoints.DetRelationConfiscationById,
      id
    );
  }

  money(id?: any): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      ConfiscationEndpoints.validateMoney,
      id
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

  getId(params?: _Params): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(
      ConfiscationEndpoints.identifier,
      params
    );
  }

  getAllMaxNoRelDec(year: number | string) {
    const route = `${ConfiscationEndpoints.Application}?year=${year}`;
    return this.get<IListResponse<IMaxNoRelDec>>(route);
  }
}

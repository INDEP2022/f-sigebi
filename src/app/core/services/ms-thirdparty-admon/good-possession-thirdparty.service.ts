import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThirdPartyAdmonEndpoints } from 'src/app/common/constants/endpoints/ms-third-party-admon-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGood } from '../../models/good/good.model';
import {
  IDetailGoodPossessionThirdParty,
  IGoodPossessionThirdParty,
} from '../../models/ms-thirdparty-admon/third-party-admon.model';

@Injectable({
  providedIn: 'root',
})
export class GoodPosessionThirdpartyService extends HttpService {
  constructor() {
    super();
    this.microservice = ThirdPartyAdmonEndpoints.BasePath;
  }

  getAll(
    params?: _Params
  ): Observable<IListResponse<IGoodPossessionThirdParty>> {
    return this.get<IListResponse<any>>(
      ThirdPartyAdmonEndpoints.GoodPossessionThirdParty,
      params
    );
  }

  getAllDetailGoodPossessionThirdParty(params?: _Params) {
    return this.get<
      IListResponse<{
        possessionNumber: number;
        goodNumber: IGood;
        steeringwheelNumber: number;
        nbOrigin: string;
      }>
    >(ThirdPartyAdmonEndpoints.DetailGoodPossessionThirdParty, params);
  }

  postThirdPartyAdmonOffice(params?: _Params) {
    return this.post<any>('aplication/thirdpartyadmonOfice', params);
  }

  postThirdPartyAdmonKey(_params?: _Params) {
    return this.post<any>('aplication/thirdpartyadmonKey', _params);
  }

  updateThirdPartyAdmonOffice(
    id: any,
    params?: Partial<IGoodPossessionThirdParty>
  ) {
    return this.put<any>(`good-possession-thirdparty/${id}`, params);
  }

  updateThirdPartyAdmonXFormatNumber(id: any, model: Object) {
    return this.put<any>(`aplication/goodXformatNumber/${id}`, model);
  }
  postGoodPossessionThirdParty(params?: IGoodPossessionThirdParty) {
    return this.post<any>(`good-possession-thirdparty`, params);
  }

  getSequenceNoPositionNextVal() {
    return this.get<any>(`aplication/seqNoPossessionNextVal`);
  }

  postDetailGoodPossessionThirdParty(params?: IDetailGoodPossessionThirdParty) {
    return this.post<any>(`detail-good-possession-thirdparty`, params);
  }

  deleteDetailGoodPossessionThirdParty(params: {
    possessionNumber: string | number;
    goodNumber?: string | number;
  }) {
    return this.delete<any>(`detail-good-possession-thirdparty`, params);
  }

  getByMonthYearIndicator(
    month: number,
    year: number,
    delegation: number,
    params: any
  ) {
    const route = `${ThirdPartyAdmonEndpoints.StrategyReports}?filter.monthNumber=$eq:${month}&filter.yearNumber=$eq:${year}&filter.delegation1Number=$eq:${delegation}`;
    return this.get(route, params);
  }

  getByMonthYearIndicatorNumber(
    month: number,
    year: number,
    delegation: number
  ) {
    const route = `${ThirdPartyAdmonEndpoints.StrategyReports}?filter.monthNumber=$eq:${month}&filter.yearNumber=$eq:${year}&filter.delegation1Number=$eq:${delegation}&filter.thisTime=$eq:1`;
    return this.get(route);
  }

  getAllStrategyFormat(params?: any) {
    const route = `${ThirdPartyAdmonEndpoints.StrategyFormat}`;
    return this.get(route, params);
  }

  getAllStrategyFormatById(id: any) {
    const route = `${ThirdPartyAdmonEndpoints.StrategyFormat}?filter.id=$eq:${id}`;
    return this.get(route);
  }

  getAllStrategyImportsById(id: any, params: any) {
    const route = `${ThirdPartyAdmonEndpoints.StrategyImports}?filter.formatNumberId=$eq:${id}`;
    return this.get(route, params);
  }

  getAllStrategyGoodsById(id: any, params: any) {
    const route = `${ThirdPartyAdmonEndpoints.StrategyGoods}?filter.formatNumber=$eq:${id}`;
    return this.get(route, params);
  }

  getAllStrategyLogById(id: any, params: any) {
    const route = `${ThirdPartyAdmonEndpoints.StrategyLog}?filter.formatNumber=$eq:${id}`;
    return this.get(route, params);
  }

  getAllStrategyV2(params?: any) {
    const route = `${ThirdPartyAdmonEndpoints.StrategyFormatV2}`;
    return this.get(route, params);
  }

  getAllStrategyGoodsByFormat(id: any) {
    const route = `${ThirdPartyAdmonEndpoints.StrategyGoods}?filter.formatNumber=$eq:${id}&filter.valGood=$eq:0`;
    return this.get(route);
  }
}

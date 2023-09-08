import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { GoodTrackerEndpoints } from 'src/app/common/constants/endpoints/ms-good-tracker-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { GoodTrackerMap } from 'src/app/pages/general-processes/goods-tracker/utils/good-tracker-map';
import {
  IListResponse,
  IListResponseMessage,
} from '../../interfaces/list-response.interface';
import { Iidentifier } from '../../models/ms-good-tracker/identifier.model';
import { ITmpTracker } from '../../models/ms-good-tracker/tmpTracker.model';
import {
  ITrackedGood,
  ITrackerGoodSocialCabinet,
  ITrackerGoodSocialCabinetObject,
} from '../../models/ms-good-tracker/tracked-good.model';

@Injectable({
  providedIn: 'root',
})
export class GoodTrackerService extends HttpService {
  constructor() {
    super();
    this.microservice = 'trackergood';
  }

  getAll(params?: _Params): Observable<IListResponseMessage<ITrackedGood>> {
    return this.get<IListResponseMessage<ITrackedGood>>(
      'trackergood/apps/goodtrackertmp',
      params
    );
  }

  getAllSocialCabinet(params?: _Params) {
    return this.get<IListResponseMessage<ITrackerGoodSocialCabinetObject>>(
      'trackergood/apps/goodtrackertmpv2',
      params
    ).pipe(
      catchError(x =>
        of({ count: 0, data: [] as ITrackerGoodSocialCabinetObject[] })
      ),
      map(response => {
        return {
          ...response,
          data: response.data.map(x => {
            return {
              ...x,
              socialCabinet: x.socialCabinet
                ? x.socialCabinet.cabinetType
                : null,
            } as ITrackerGoodSocialCabinet;
          }),
        };
      })
    );
  }

  trackGoods(filters: GoodTrackerMap, params: _Params) {
    return this.post<IListResponseMessage<ITrackedGood>>(
      'trackergood/apps/pup-consult',
      filters,
      params
    );
  }

  trackGoodsWidthNotGoods(filters: GoodTrackerMap, params?: string) {
    params = 'flag=true' + (params.length > 0 ? '&' + params : '');
    return this.post<IListResponseMessage<ITrackedGood>>(
      'trackergood/apps/pup-consult-goodNumerNot?',
      filters,
      params
    );
  }

  getAllTmpTracker(params?: _Params): Observable<IListResponse<ITmpTracker>> {
    return this.get<IListResponse<ITmpTracker>>(
      GoodTrackerEndpoints.TmpTracker,
      params
    );
  }

  getTvGoodTrackerFilter(params: any) {
    return this.get('t-v-goods-tracker', params);
  }

  getAllModal(
    self?: GoodTrackerService,
    params?: _Params
  ): Observable<IListResponse<ITrackedGood>> {
    return self.get<IListResponse<ITrackedGood>>(
      'trackergood/apps/goodtrackertmp',
      params
    );
  }

  getIdentifier() {
    return this.get<Iidentifier>(GoodTrackerEndpoints.GenerateIdentifier);
  }

  createTmpTracker(tmpTracker: ITmpTracker) {
    return this.post(GoodTrackerEndpoints.TmpTracker, tmpTracker);
  }

  includeAll(filters: any) {
    return this.post('trackergood/apps/pup-consult-with-insert', filters);
  }

  getExcel(tmp: GoodTrackerMap) {
    return this.post<{ token: string }>(GoodTrackerEndpoints.GoodExcel, tmp);
  }

  donwloadExcel(token: string) {
    return this.get(`${GoodTrackerEndpoints.DownloadExcel}/${token}`);
  }

  getPhotos(tmp: GoodTrackerMap) {
    return this.post<{ token: string }>(GoodTrackerEndpoints.GoodPhotos, tmp);
  }

  PaInsGoodParameters(params: any) {
    const route = `${GoodTrackerEndpoints.PaInsGoodParameters}`;
    return this.post(route, params);
  }

  PaInsGoodtmptracker(traker: any) {
    const route = `${GoodTrackerEndpoints.TmpTracker}?filter.identificator=$eq:${traker}`;
    return this.get(route);
  }

  tmptracker(ident: number) {
    return this.get(
      `${this.microservice}/tmptracker?filter.identificator=$eq:${ident}`
    );
  }

  getGoodTrackerTmp(goodNum: number) {
    return this.get(
      `${this.microservice}/apps/goodtrackertmp?filter.goodNumber=$eq:${goodNum}`
    );
  }

  deleteTrackerGood(id: number) {
    return this.delete(`${this.microservice}/apps/deleteRegister/${id}`);
  }
}

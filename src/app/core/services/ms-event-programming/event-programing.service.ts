import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  ICertificateProgDst,
  IGoodIndicator,
} from '../../models/ms-event-programming/good-indicators.model';
@Injectable({
  providedIn: 'root',
})
export class EventProgrammingService extends HttpService {
  constructor() {
    super();
    this.microservice = 'eventprogramming';
  }
  /// /api/v1/ssf3-certificate-prog-dst
  getFolio(body: any) {
    return this.post<{ folio: string }>('functions/get-folio', body);
  }

  valUserInd(body: any) {
    return this.post<{ level: string }>('functions/fa-val-user-ind', body);
  }

  getGoodsIndicators(keyProceeding: string | number, params?: _Params) {
    return this.get<IListResponse<IGoodIndicator>>(
      'goods-indicators/get-goods-indicators/' + keyProceeding,
      params
    );
  }
  putCertificateProgDst(model: ICertificateProgDst) {
    return this.put<ICertificateProgDst>('ssf3-certificate-prog-dst', model);
  }
  putSsf3(model: any) {
    return this.post<ICertificateProgDst>('/functions/update-ssf3', model);
  }
  //http://sigebimsdev.indep.gob.mx/eventprogramming/api/v1/functions/update-ssf3
  massiveDeleteAndUpdate(model: any) {
    return this.post<IListResponse>(
      'ssf3-certificate-prog-dst/massiveDeleteAndUpdate',
      model
    );
  }

  faValUserInd(model: any) {
    return this.post<any>('functions/fa-val-user-ind', model);
  }
}

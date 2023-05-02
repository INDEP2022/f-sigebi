import { Injectable } from '@angular/core';
import { LabelGoodEndPoints } from 'src/app/common/constants/endpoints/label-good-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ILabelOKey } from '../../models/catalogs/label-okey.model';

@Injectable({
  providedIn: 'root',
})
export class LabelGoodService extends HttpService {
  constructor() {
    super();
    this.microservice = LabelGoodEndPoints.cat;
  }
  getEtiqXClasif(_params: _Params) {
    return this.get<IListResponse<ILabelOKey>>(
      LabelGoodEndPoints.labelGood,
      _params
    );
  }
}

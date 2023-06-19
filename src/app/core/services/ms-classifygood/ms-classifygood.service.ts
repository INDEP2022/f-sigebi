import { Injectable } from '@angular/core';
import { ClassifyGoodEndPoints } from 'src/app/common/constants/endpoints/ms-classifgood-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IEtiqXClassif,
  ITagXClasif,
  IUnitXClassif,
} from '../../models/ms-classifygood/ms-classifygood.interface';

@Injectable({
  providedIn: 'root',
})
export class ClassifyGoodService extends HttpService {
  constructor() {
    super();
    this.microservice = ClassifyGoodEndPoints.classifygood;
  }

  getTagXClassif(body: ITagXClasif) {
    return this.post(ClassifyGoodEndPoints.tagXClassif, body);
  }
  getUnitiXClasif(_params: _Params) {
    return this.get<IListResponse<IUnitXClassif>>(
      ClassifyGoodEndPoints.unitXVlassif,
      _params
    );
  }
  getEtiqXClasif(_params: _Params) {
    return this.get<IListResponse<IEtiqXClassif>>(
      ClassifyGoodEndPoints.etiqXVlassif,
      _params
    );
  }

  getChangeClass(params?: string) {
    return this.get<IListResponse>(`change-classification-goods?${params}`);
  }

  getPupDistClasif(user: string) {
    const route = ClassifyGoodEndPoints.PupDistClasif;
    return this.get(`${route}?username=${user}`);
  }
}

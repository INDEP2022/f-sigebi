import { Injectable } from '@angular/core';
import { GoodProcessPoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IResponse } from '../../interfaces/list-response.interface';
import {
  IGoodAndDetailProceeding,
  IValNumeOtro,
} from '../../models/ms-good/good';

@Injectable({
  providedIn: 'root',
})
export class GoodProcessService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodProcessPoints.basepath;
  }

  getValNume(model: IValNumeOtro) {
    return this.post<IResponse>(GoodProcessPoints.cuValNume, model);
  }

  getValOtro(model: IValNumeOtro) {
    return this.post<IResponse>(GoodProcessPoints.cuValOtro, model);
  }

  getDetailProceedginGood(model: IGoodAndDetailProceeding) {
    return this.post<IResponse>(GoodProcessPoints.goodAndDetail, model);
  }
}

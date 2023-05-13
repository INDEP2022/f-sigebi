import { Injectable } from '@angular/core';
import { GoodProcessPoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IResponse } from '../../interfaces/list-response.interface';
import {
  IAcceptGoodActa,
  IAcceptGoodStatusScreen,
  IGoodAndDetailProceeding,
  ILvlPrograma,
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

  getVnNumerario(id: string | number) {
    return this.get(`${GoodProcessPoints.vnNumerario}?no_bien=${id}`);
  }

  getLvlPrograma(model: ILvlPrograma) {
    return this.post<IResponse>(GoodProcessPoints.lvlPrograma, model);
  }

  getDetailProceedginGood(model: IGoodAndDetailProceeding) {
    return this.post<IResponse>(GoodProcessPoints.goodAndDetail, model);
  }

  getDetailProceedingGoodFilterNumber(
    model: IGoodAndDetailProceeding,
    noActa: string
  ) {
    return this.post<IResponse>(
      `${GoodProcessPoints.goodAndDetail}?filter.proceedingsnumber=${noActa}`,
      model
    );
  }

  getacceptGoodActa(model: IAcceptGoodActa) {
    return this.post<IResponse>(GoodProcessPoints.acceptGoodActa, model);
  }

  getacceptGoodStatusScreen(model: IAcceptGoodStatusScreen) {
    return this.post<IResponse>(
      GoodProcessPoints.acceptGoodStatusScreen,
      model
    );
  }
}

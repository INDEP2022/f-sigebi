import { Injectable } from '@angular/core';
import { PrepareEventEndpoints } from 'src/app/common/constants/endpoints/ms-prepareevent-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IEncrypt } from '../../models/ms-prepareevent/util-comer-v1-model';

@Injectable({
  providedIn: 'root',
})
export class UtilComerV1Service extends HttpService {
  constructor() {
    super();
    this.microservice = PrepareEventEndpoints.PreparaEvent;
  }

  processTracker(body: {
    id: string | number;
    dir: string | number;
    event: string | number;
    lot: string | number;
    tpeve2: string | number;
    program: string | number;
    lotepub: string | number;
    user: string | number;
  }) {
    return this.post(PrepareEventEndpoints.ProcessesTracker, body);
  }

  encrypt(model: IEncrypt) {
    return this.post(PrepareEventEndpoints.Encrypt, model);
  }

  getPufSearchEvent(goodNumber: string) {
    return this.get(
      PrepareEventEndpoints.ApplicationPufSearchEvent + '/' + goodNumber
    );
  }

  /** UTIL_COMER.PRECIOS_VTA  */
  salePrices(body: { event: string | number; lot?: string | number }) {
    return this.post(PrepareEventEndpoints.SalePrices, body);
  }

  acceptConsigment(body: {
    lotId: string | number;
    eventId: string | number;
    blkRemittancesGood: any[];
  }) {
    return this.post(
      'application/blk-remesas-eve-accept-when-button-pressed',
      body
    );
  }

  acceptPreparation(body: {
    lotId: string | number;
    eventId: string | number;
    tpeventId: string | number;
    blkPrepGood: any[];
  }) {
    return this.post(
      'application/blk-prep-eve-acceptaa-when-button-pressed',
      body
    );
  }
}

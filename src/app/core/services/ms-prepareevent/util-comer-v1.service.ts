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

  encrypt(model: IEncrypt) {
    return this.post(PrepareEventEndpoints.Encrypt, model);
  }

  getPufSearchEvent(goodNumber: string) {
    return this.get(
      PrepareEventEndpoints.ApplicationPufSearchEvent + '/' + goodNumber
    );
  }
}

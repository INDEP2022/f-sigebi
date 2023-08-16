import { Injectable } from '@angular/core';
import { LotEndpoints } from 'src/app/common/constants/endpoints/ms-lot-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import {
  ILotDTO,
  IValidStatusChangeDTO,
  IValidSubPriceDTO,
} from '../models/lot';

@Injectable({
  providedIn: 'root',
})
export class ExpenseLotService extends HttpService {
  private readonly endpoint = LotEndpoints.ComerLot;
  constructor() {
    super();
    this.microservice = LotEndpoints.BasePath;
  }

  PUF_VALIDA_PAGOXEVENTO(body: ILotDTO) {
    return this.post('puf-valid-payment-event', body);
  }

  VALIDA_CAMBIO_ESTATUS(body: IValidStatusChangeDTO) {
    return this.post('valid-status-change', body);
  }

  VALIDA_SUBTOTAL_PRECIO(body: IValidSubPriceDTO) {
    return this.post('validSubTotPrice', body);
  }

  // update(id) {
  //   this.put(this.endpoint+'/'+,);
  // }
}

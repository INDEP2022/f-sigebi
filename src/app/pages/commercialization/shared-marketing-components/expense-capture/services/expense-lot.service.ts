import { Injectable } from '@angular/core';
import { LotEndpoints } from 'src/app/common/constants/endpoints/ms-lot-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import {
  ICancelVtaDTO,
  IDivideCommandsDTO,
  ILoadLotDTO,
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

  getAll(_params: _Params) {
    return this.get(this.endpoint, _params);
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

  DIVIDE_MANDATOS(body: IDivideCommandsDTO) {
    return this.post('apps/divide-commands', body);
  }

  CARGA_BIENES_LOTE(body: ILoadLotDTO) {
    return this.post('apps/load-goods-lot', body);
  }

  CANCELA_VTA_NORMAL(body: ICancelVtaDTO) {
    return this.post('apps/post-cancela-vta-normal', body);
  }
  // update(id) {
  //   this.put(this.endpoint+'/'+,);
  // }
}

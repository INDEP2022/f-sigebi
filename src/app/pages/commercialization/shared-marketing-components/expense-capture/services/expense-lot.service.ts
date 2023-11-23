import { Injectable } from '@angular/core';
import { LotEndpoints } from 'src/app/common/constants/endpoints/ms-lot-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from 'src/app/core/interfaces/list-response.interface';
import { IComerDetBills } from '../models/bills';
import {
  ICancelVtaDTO,
  IDivideCommandsDTO,
  ILoadLotDelResDTO,
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
    return this.post('apps/puf-valid-payment-event', body);
  }

  VALIDA_CAMBIO_ESTATUS(body: IValidStatusChangeDTO) {
    return this.post('apps/valid-status-change', body);
  }

  VALIDA_SUBTOTAL_PRECIO(body: IValidSubPriceDTO) {
    return this.post('validSubTotPrice', body);
  }

  DIVIDE_MANDATOS(body: IDivideCommandsDTO) {
    return this.post<
      IListResponseMessage<{
        id_detgasto: number;
        id_gasto: number;
        iva2: number;
        mandato: string;
        mandato2: string;
        monto2: number;
        no_transferente: number;
        retencion_isr2: number;
        retencion_iva2: number;
        total2: number;
      }>
    >('apps/divide-commands', body);
  }

  CARGA_BIENES_LOTE(body: ILoadLotDTO) {
    return this.post('apps/load-goods-lot', body);
  }

  CARGA_BIENES_LOTE_DELRES(body: ILoadLotDelResDTO) {
    return this.post('apps/carga-bienes-lote-xdelres', body);
  }

  CANCELA_VTA_NORMAL(body: ICancelVtaDTO) {
    return this.post('apps/post-cancela-vta-normal', body);
  }

  CANCELACION_PARCIAL(body: {
    pLotId: number;
    pEventId: number;
    pLotPub: string;
    pSpentId: number;
    pTotIva: string;
    pTotMonto: string;
    pTotTot: string;
    comerDetBills: IComerDetBills[];
  }) {
    return this.post('apps/partial-cancellation', body);
  }

  DEVOLUCION_PARCIAL(body: {
    dpLote: number;
    pPrueba: number;
    pCambiaStatus: string;
    user: string;
    spentId: number;
    cat_motivos_rev: string[];
  }) {
    return this.post('apps/partial-return', body);
  }
  // update(id) {
  //   this.put(this.endpoint+'/'+,);
  // }
}

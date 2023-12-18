import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { LotEndpoints } from 'src/app/common/constants/endpoints/ms-lot-endpoint';
import { PrepareEventEndpoints } from 'src/app/common/constants/endpoints/ms-prepareevent-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from 'src/app/core/interfaces/list-response.interface';
import { IComerDetBills } from '../models/bills';
import {
  ICancelVtaDTO,
  IDivideCommandsDTO,
  IFillDatosRevDTO,
  ILoadLotDelResDTO,
  ILoadLotDTO,
  ILoadLotResponse,
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
        MONTO2: number;
        no_transferente: number;
        retencion_isr2: number;
        retencion_iva2: number;
        total2: number;
      }>
    >('apps/divide-commands', body);
  }

  CARGA_BIENES_LOTE(body: ILoadLotDTO) {
    return this.post<IListResponseMessage<ILoadLotResponse>>(
      'apps/load-goods-lot',
      body
    );
  }

  CARGA_BIENES_LOTE_DELRES(body: ILoadLotDelResDTO) {
    return this.post<IListResponseMessage<ILoadLotResponse>>(
      'apps/carga-bienes-lote-xdelres',
      body
    );
  }

  CANCELA_VTA_NORMAL(body: ICancelVtaDTO) {
    return this.post('apps/post-cancela-vta-normal', body);
  }

  PUP_LLENA_DATOSREV(body: IFillDatosRevDTO) {
    return this.post('apps/pup-fill-rev-data', body);
  }

  CANCELACION_PARCIAL(body: {
    pLotId: number;
    pEventId: number;
    pLotPub: string;
    pSpentId: number;
    pTotIva: string;
    pTotMonto: string;
    pTotTot: string;
    address: string;
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
    address: string;
    cat_motivos_rev: { motiveDescription: string; selection: number }[];
  }) {
    return this.post('apps/partial-return', body);
  }

  update(body: any) {
    const id = body.idLot;
    delete body.idLot;
    return this.put(this.endpoint + '/' + id, body);
  }

  getComerGoodXLote(params: _Params) {
    return this.get(PrepareEventEndpoints.ComerGoodXLote, params);
  }

  spentExpedientWhere(idGasto: number) {
    return this.get<{ data: { no_expediente: string }[] }>(
      'apps/spent-expendient-where/' + idGasto
    ).pipe(
      catchError(x => of({ data: [] })),
      map(x => (x.data.length > 0 ? x.data.map(x => x.no_expediente) : []))
    );
  }

  foliosAsociadosExpediente_a_Null(idGasto: number) {
    return this.put('apps/update-document/' + idGasto);
  }
}

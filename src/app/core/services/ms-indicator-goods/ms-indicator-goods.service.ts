import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { EIndicatorGoodsEndpoints } from 'src/app/common/constants/endpoints/ms-indicatorgoods-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IFormScheduledDetail } from 'src/app/pages/judicial-physical-reception/scheduled-maintenance-1/scheduled-maintenance-detail/interfaces';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IDetailIndicatorGood,
  IGoodsByProceeding,
} from '../../models/ms-indicator-goods/ms-indicator-goods-interface';

@Injectable({
  providedIn: 'root',
})
export class MsIndicatorGoodsService extends HttpService {
  private readonly endpoint = EIndicatorGoodsEndpoints.Detail;
  constructor() {
    super();
    this.microservice = EIndicatorGoodsEndpoints.BasePath;
  }

  getById(goodNumber: string, actNumber: string) {
    return this.post(this.endpoint + '/id', { goodNumber, actNumber });
  }

  deleteById(goodNumber: string, actNumber: string) {
    return this.delete(this.endpoint, { goodNumber, actNumber });
  }

  update(model: IDetailIndicatorGood) {
    return this.put(this.endpoint, model);
  }

  getByGoodRastrer(goodNumber: number[], good: IGoodsByProceeding) {
    return this.post<IListResponse<IGoodsByProceeding[]>>(
      this.endpoint + '/Insert',
      { goodNumber }
    ).pipe(
      map(items => {
        const data = items.data;
        return {
          ...items,
          data: data.map(item => {
            const row = item[0];
            return {
              ...row,
              fec_aprobacion_x_admon: good.fec_aprobacion_x_admon,
              fec_indica_usuario_aprobacion: good.fec_indica_usuario_aprobacion,
            };
          }),
        };
      })
    );
  }

  getCountDictationByAct(area: string, acta: string) {
    return this.get<IListResponse<{ count: number }>>(
      this.endpoint + '/getCountDictation/' + area + '/' + acta
    ).pipe(
      map(x => {
        return x.data[0].count;
      })
    );
  }

  updateMassive(
    selecteds: {
      fec_aprobacion_x_admon: string;
      fec_indica_usuario_aprobacion: string;
      no_bien: string;
    }[],
    numberProceedings: number
  ) {
    return forkJoin(
      selecteds.map(selected => {
        return this.getById(selected.no_bien, numberProceedings + '').pipe(
          mergeMap(detail => {
            return this.put(this.endpoint, {
              ...detail,
              approvedXAdmonDate: selected.fec_aprobacion_x_admon,
              dateIndicatesUserApproval: selected.fec_indica_usuario_aprobacion,
              numberGood: selected.no_bien,
            });
          })
        );
      })
    );
  }

  getGoodsByProceeding(params?: ListParams) {
    return this.get<IListResponse<IGoodsByProceeding>>(
      this.endpoint + '/' + EIndicatorGoodsEndpoints.GoodsByEvent,
      params
    ).pipe(
      map(items => {
        const data = items.data;
        return {
          ...items,
          data: data.map(item => {
            return {
              ...item,
              fec_aprobacion_x_admon: format(
                new Date(item.fec_aprobacion_x_admon),
                'dd/MM/yyyy'
              ),
              fec_indica_usuario_aprobacion: format(
                new Date(item.fec_indica_usuario_aprobacion),
                'dd/MM/yyyy'
              ),
            };
          }),
        };
      })
    );
  }

  getExcel(detail: IFormScheduledDetail) {
    const params = new ListParams();
    params.limit = 100000;
    params['id'] = detail.acta;
    return this.getGoodsByProceeding(params).pipe(
      map(items => {
        const data = items.data;
        return data.map((item, index) => {
          return {
            PROGRAMA: detail.claveActa,
            'LOCALIDAD/DICTAMEN': item.ciudad_transferente,
            NO_BIEN: item.no_bien,
            ESTATUS: item.estatus,
            DESCRIPCION: item.descripcion,
            TIPO_BIEN: item.tipo_bien,
            EXPEDIENTE: item.no_expediente,
            EVENTO: index + 1,
            CANTIDAD: item.cantidad,
            FEC_RECEPCION: item.fec_aprobacion_x_admon,
            FEC_FINALIZACION: item.fec_indica_usuario_aprobacion,
            INDICADOR_DEST: item.destino,
          };
        });
      })
    );
  }
}

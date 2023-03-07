import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { EIndicatorGoodsEndpoints } from 'src/app/common/constants/endpoints/ms-indicatorgoods-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { IFormScheduledDetail } from 'src/app/pages/judicial-physical-reception/scheduled-maintenance-1/scheduled-maintenance-detail/interfaces';
import { firstFormatDate } from 'src/app/shared/utils/date';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodsByProceeding } from '../../models/ms-indicator-goods/ms-indicator-goods-interface';

@Injectable({
  providedIn: 'root',
})
export class MsIndicatorGoodsService extends HttpService {
  private readonly endpoint = EIndicatorGoodsEndpoints.Goods;
  constructor() {
    super();
    this.microservice = EIndicatorGoodsEndpoints.BasePath;
  }

  getGoodsByProceeding(id: string) {
    return this.get<IListResponse<IGoodsByProceeding>>(
      this.endpoint + '/' + EIndicatorGoodsEndpoints.GoodsByEvent + '/' + id
    ).pipe(
      map(items => {
        const data = items.data;
        return {
          ...items,
          data: data.map(item => {
            return {
              ...item,
              fec_aprobacion_x_admon: firstFormatDate(
                new Date(item.fec_aprobacion_x_admon)
              ),
              fec_indica_usuario_aprobacion: firstFormatDate(
                new Date(item.fec_indica_usuario_aprobacion)
              ),
            };
          }),
        };
      })
    );
  }

  getExcel(detail: IFormScheduledDetail) {
    // const params = new ListParams();
    // params.limit = 100000;
    return this.getGoodsByProceeding(detail.acta).pipe(
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

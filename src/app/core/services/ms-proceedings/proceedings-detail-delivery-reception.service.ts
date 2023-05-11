import { Injectable } from '@angular/core';
import { catchError, forkJoin, mergeMap, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProceedingsEndpoints } from 'src/app/common/constants/endpoints/ms-proceedings-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { formatForIsoDate } from 'src/app/shared/utils/date';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodsByProceeding } from '../../models/ms-indicator-goods/ms-indicator-goods-interface';
import { IDetailProceedingsDeliveryReception } from '../../models/ms-proceedings/detail-proceeding-delivery-reception';
import { PBDelete } from '../../models/ms-proceedings/proceeding-aplication.model';
import {
  IDeleted,
  INotDeleted,
} from './proceedings-delivery-reception.service';

@Injectable({
  providedIn: 'root',
})
export class ProceedingsDetailDeliveryReceptionService extends HttpService {
  private readonly endpoint =
    ProceedingsEndpoints.DetailProceedingsDeliveryReception;
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
  }

  getExpedients(id: string) {
    return this.get<{ count: { count: string }[] }>(
      this.endpoint + '/getCountExpedient/' + id + '/ENTREGA'
    ).pipe(
      map(x => {
        return x.count[0].count ?? 0;
      })
    );
  }

  create(model: IDetailProceedingsDeliveryReception) {
    return this.post<{
      message: string[];
      data: IDetailProceedingsDeliveryReception;
    }>(this.endpoint, model);
  }

  deleteMasive(
    selecteds: IGoodsByProceeding[],
    processingArea: string,
    numberProceedings: number
  ) {
    return forkJoin(
      selecteds.map(selected => {
        return this.deleteByIdBP(
          numberProceedings,
          processingArea,
          selected
        ).pipe(
          map(item => {
            return { deleted: selected.no_bien } as IDeleted;
          }),
          catchError(err => of({ error: selected.no_bien } as INotDeleted))
        );
      })
    );
  }

  update(detail: IDetailProceedingsDeliveryReception) {
    return this.put(this.endpoint, {
      ...detail,
    });
  }

  updateMasive(
    selecteds: {
      fec_aprobacion_x_admon: string;
      fec_indica_usuario_aprobacion: string;
      no_bien: string;
    }[],
    numberProceedings: number
  ) {
    return forkJoin(
      selecteds.map(selected => {
        return this.getById(+selected.no_bien, numberProceedings).pipe(
          mergeMap(detail => {
            return this.put(this.endpoint, {
              ...detail,
              approvedDateXAdmon: selected.fec_aprobacion_x_admon,
              dateIndicatesUserApproval: selected.fec_indica_usuario_aprobacion,
              numberGood: selected.no_bien,
            });
          })
        );
      })
    );
  }

  getById(numberGood: number, numberProceedings: number) {
    return this.post(this.endpoint + '/id', { numberGood, numberProceedings });
  }

  deleteByIdBP(
    actaNumber: number,
    processingArea: string,
    detail: IGoodsByProceeding
  ) {
    const body: PBDelete = {
      actaNumber,
      goodNumber: +detail.no_bien,
      states: detail.estatus,
      processingArea,
      user: localStorage.getItem('username'),
    };
    return this.post(
      this.endpoint + '/' + ProceedingsEndpoints.DeleteProceedinGood,
      { body }
    );
  }

  deleteById(numberGood: number, numberProceedings: number) {
    return this.delete(this.endpoint, { numberGood, numberProceedings });
  }

  getDataByGood(
    self?: ProceedingsDetailDeliveryReceptionService,
    params?: string
  ) {
    return self.get<IListResponse<ProceedingsDetailDeliveryReceptionService>>(
      self.endpoint,
      params
    );
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IDetailProceedingsDeliveryReception>> {
    return this.get<IListResponse<IDetailProceedingsDeliveryReception>>(
      this.endpoint,
      params
    );
  }

  getAll3(
    params?: ListParams | string
  ): Observable<IListResponse<IDetailProceedingsDeliveryReception>> {
    return this.get<IListResponse<IDetailProceedingsDeliveryReception>>(
      this.endpoint,
      params
    ).pipe(
      map(items => {
        return {
          ...items,
          data: items.data.map(item => {
            return {
              ...item,
              description: item.good.description,
              approvedDateXAdmon: formatForIsoDate(
                item.approvedDateXAdmon + '',
                'string'
              ),
              approvedUserXAdmon: item.approvedUserXAdmon,
              dateIndicatesUserApproval: formatForIsoDate(
                item.dateIndicatesUserApproval + '',
                'string'
              ),
              status: item.good.status,
              warehouse: item.good.storeNumber,
              vault: item.good.vaultNumber,
            };
          }),
        };
      })
    );
  }

  getAll2(self?: ProceedingsDetailDeliveryReceptionService, params?: string) {
    return self.get<IListResponse<IDetailProceedingsDeliveryReception>>(
      self.endpoint,
      params
    );
  }
}

import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import { ProceedingsEndpoints } from 'src/app/common/constants/endpoints/ms-proceedings-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodsByProceeding } from '../../models/ms-indicator-goods/ms-indicator-goods-interface';
import { IDetailProceedingsDeliveryReception } from '../../models/ms-proceedings/detail-proceeding-delivery-reception';
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

  deleteMasive(selecteds: IGoodsByProceeding[], numberProceedings: number) {
    return forkJoin(
      selecteds.map(selected => {
        return this.delete(this.endpoint, {
          numberGood: selected.no_bien,
          numberProceedings,
        }).pipe(
          map(item => {
            return { deleted: selected.no_bien } as IDeleted;
          }),
          catchError(err => of({ error: selected.no_bien } as INotDeleted))
        );
      })
    );
  }

  getById(numberGood: number, numberProceedings: number) {
    return this.post(this.endpoint + '/id', { numberGood, numberProceedings });
  }

  deleteById(numberGood: number, numberProceedings: number) {
    return this.delete(this.endpoint, { numberGood, numberProceedings });
  }

  updateMasive(selecteds: IGoodsByProceeding[], numberProceedings: number) {
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

  getAll2(self?: ProceedingsDetailDeliveryReceptionService, params?: string) {
    return self.get<IListResponse<IDetailProceedingsDeliveryReception>>(
      self.endpoint,
      params
    );
  }
}

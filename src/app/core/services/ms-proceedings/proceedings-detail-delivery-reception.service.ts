import { Injectable } from '@angular/core';
import { catchError, forkJoin, mergeMap, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProceedingsEndpoints } from 'src/app/common/constants/endpoints/ms-proceedings-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import {
  firstFormatDateToSecondFormatDate,
  formatForIsoDate,
} from 'src/app/shared/utils/date';
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

  private getColumnByAreaTramite(area: string, item: IGoodsByProceeding) {
    switch (area) {
      case 'RF':
        return item.clave_dictamen;
      case 'DV':
        return item.clave_acta_devolucion;
      // case 'DS':
      //   return item.clave_acta_destruccion;
      // case 'CM':
      //   return item.cve_evento;
      // case 'DN':
      //   return item.cve_dic_donacion;
      default:
        return item.clave_acta_destruccion;
    }
  }

  getGoodByRastrer(
    goods: number[],
    action: string,
    typeProceeding: string,
    good: IGoodsByProceeding
  ) {
    return this.post<IListResponse<IGoodsByProceeding>>(
      'aplication/get-goods-indicators',
      { goods, action, typeProceeding }
    ).pipe(
      map(items => {
        // debugger;
        let dictamenes = [
          ...new Set(
            items.data.map(item => this.getColumnByAreaTramite(action, item))
          ),
        ];
        let expedientes = [
          ...new Set(items.data.map(item => item.no_expediente)),
        ];
        let bienes = 0;
        const data = items.data.map(item => {
          bienes += +(item.cantidad + '');
          return {
            ...item,
            fec_aprobacion_x_admon: good.fec_aprobacion_x_admon,
            fec_indica_usuario_aprobacion: good.fec_indica_usuario_aprobacion,
            agregado: 'RA',
          };
        });
        return {
          ...items,
          data,
          expedientes: expedientes.length,
          dictamenes: dictamenes.length,
          bienes,
        };
      })
    );
  }

  getExpedients(id: string, typeEvent: string) {
    return this.get<{ count: { count: string }[] }>(
      `${this.endpoint}/getCountExpedient/${id}/${typeEvent}`
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

  createMassive(selecteds: IDetailProceedingsDeliveryReception[]) {
    return forkJoin(
      selecteds.map(selected => {
        // selected.numberGood
        delete selected.good;
        delete selected.description;
        delete selected.status;
        delete selected.warehouse;
        delete selected.vault;
        return this.create(selected).pipe(
          map(item => {
            return { deleted: selected.good.id } as IDeleted;
          }),
          catchError(err => of({ error: selected.good.id } as INotDeleted))
        );
      })
    );
  }

  deleteMassiveByIds(selecteds?: IDetailProceedingsDeliveryReception[]) {
    return forkJoin(
      selecteds.map(selected =>
        this.deleteById(selected.good.goodId, selected.numberProceedings).pipe(
          map(item => {
            return { deleted: selected.good.goodId } as IDeleted;
          }),
          catchError(err => of({ error: selected.good.goodId } as INotDeleted))
        )
      )
    );
  }

  // deleteById(numberGood: number, numberProceedings: number) {
  //   return this.delete(this.endpoint, { numberGood, numberProceedings });
  // }

  // deleteMasive(
  //   selecteds: IGoodsByProceeding[],
  //   processingArea: string,
  //   numberProceedings: number
  // ) {
  //   return forkJoin(
  //     selecteds.map(selected => {
  //       return this.deleteByIdBP(
  //         numberProceedings,
  //         processingArea,
  //         selected
  //       ).pipe(
  //         map(item => {
  //           return { deleted: selected.no_bien } as IDeleted;
  //         }),
  //         catchError(err => of({ error: selected.no_bien } as INotDeleted))
  //       );
  //     })
  //   );
  // }

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
              approvedDateXAdmon: firstFormatDateToSecondFormatDate(
                selected.fec_aprobacion_x_admon + ''
              ),
              dateIndicatesUserApproval: firstFormatDateToSecondFormatDate(
                selected.fec_indica_usuario_aprobacion
              ),
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

  deleteByBP(
    actaNumber: number,
    processingArea: string,
    details: IGoodsByProceeding[]
  ) {
    const body: PBDelete = {
      processingArea,
      user: localStorage.getItem('username'),
      actaNumber,
      goods: details.map(detail => {
        return { noBien: +(detail.no_bien + ''), status: detail.estatus };
      }),
    };
    //   actaNumber,
    //   goodNumber: +detail.no_bien,
    //   states: detail.estatus,
    //   processingArea,
    //   user: localStorage.getItem('username'),
    //   contEli
    // };
    return this.post(ProceedingsEndpoints.DeleteProceedinGood, body);
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
              description: item.good?.description ?? '',
              approvedDateXAdmon: item.approvedDateXAdmon
                ? formatForIsoDate(item.approvedDateXAdmon + '', 'string')
                : null,
              approvedUserXAdmon: item.approvedUserXAdmon ?? null,
              dateIndicatesUserApproval: item.dateIndicatesUserApproval
                ? formatForIsoDate(
                    item.dateIndicatesUserApproval + '',
                    'string'
                  )
                : null,
              // amount: item.good.quantity,
              status: item.good?.status ?? null,
              warehouse: item.good?.storeNumber ?? null,
              vault: item.good?.vaultNumber ?? null,
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

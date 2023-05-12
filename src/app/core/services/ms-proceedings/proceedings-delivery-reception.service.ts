import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { catchError, forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { ProceedingsEndpoints } from '../../../common/constants/endpoints/ms-proceedings-endpoints';
import {
  IListResponse,
  IResponse,
} from '../../interfaces/list-response.interface';
import { IProceedingDeliveryReception } from '../../models/ms-proceedings/proceeding-delivery-reception';
import { IProccedingsDeliveryReception } from '../../models/ms-proceedings/proceedings-delivery-reception-model';
import { IProceedings } from '../../models/ms-proceedings/proceedings.model';
import { ProceedingsDetailDeliveryReceptionService } from './proceedings-detail-delivery-reception.service';

export interface IProceedingByGood {
  proceedingnumber: string;
  proceedingkey: string;
  proceedingstatus: string;
  programmingtype: string;
}

export interface IDeleted {
  deleted: string;
}

export interface INotDeleted {
  error: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProceedingsDeliveryReceptionService extends HttpService {
  private readonly endpoint = ProceedingsEndpoints.ProceedingsDeliveryReception;
  constructor(
    private detailService: ProceedingsDetailDeliveryReceptionService
  ) {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
  }

  getTypes() {
    return this.get<IListResponse<{ id: string; description: string }>>(
      this.endpoint + '/get-types'
    );
  }

  paMaintenance(pusuarioDeti: string, pUsuarioReq: string, pObserv: string) {
    return this.post<IResponse>(this.endpoint + '/pa-maintenance', {
      pusuarioDeti,
      pUsuarioReq,
      pObserv,
    });
  }

  deleteMasive(selecteds: IProceedingDeliveryReception[]) {
    // return this.post(this.endpoint + '/' + ProceedingsEndpoints.DeleteMassiveProceeding, {pbDelete});
    return forkJoin(
      selecteds.map(selected => {
        return this.delete(this.endpoint + '/' + selected.id).pipe(
          map(item => {
            return { deleted: selected.id } as IDeleted;
          }),
          catchError(err => {
            if (err.error.message.includes('detalle_acta_ent_recep')) {
              return of({ error: selected.id } as INotDeleted);
            } else {
              return of({ error: null } as INotDeleted);
            }
          })
        );
      })
    );
  }

  deleteById(selected: IProceedingDeliveryReception) {
    return this.delete(this.endpoint + '/' + selected.id);
  }

  private validationObs(obs: Observable<any>[]) {
    return obs ? (obs.length > 0 ? forkJoin(obs) : of([])) : of([]);
  }

  getExcel(filterParams?: FilterParams) {
    const params = new FilterParams(filterParams);
    params.limit = 10000;
    return this.get<IListResponse<IProceedingDeliveryReception>>(
      this.endpoint,
      params.getParams()
    ).pipe(
      map(items => {
        console.log(items);
        const data = items.data;
        const array: Observable<any>[] = [];
        if (data && data.length > 0) {
          data.forEach(item => {
            console.log(item);
            const paramsDetail = new FilterParams();
            paramsDetail.limit = 100000;
            paramsDetail.addFilter('numberProceedings', item.id);
            array.push(
              this.detailService.getAll(paramsDetail.getParams()).pipe(
                catchError(err => of({ data: [] })),
                map(details => {
                  const arrayDetails: any[] = [];
                  const dataDetail = details.data;
                  if (dataDetail && dataDetail.length > 0) {
                    dataDetail.forEach(detail => {
                      console.log(detail);
                      arrayDetails.push({
                        PROGRAMA: item.keysProceedings,
                        'LOCALIDAD/DICTAMEN':
                          item.numTransfer?.description ?? '',
                        'NO BIEN': detail.numberGood,
                        ESTATUS: detail.good?.status,
                        DESCRIPCION: detail.good?.description,
                        'TIPO BIEN': detail.good?.goodsCategory,
                        EXPEDIENTE: item.numFile,
                        EVENTO: detail.numberProceedings,
                        CANTIDAD: detail.amount,
                        FEC_RECEPCION: detail.approvedXAdmon,
                        FEC_FINALIZACION: detail.dateIndicatesUserApproval
                          ? format(
                              new Date(detail.dateIndicatesUserApproval),
                              'dd/MM/yyyy'
                            )
                          : '',
                        INDICADOR_DEST: detail.good?.identifier,
                      });
                    });
                  }
                  return arrayDetails;
                })
              )
            );
          });
        }
        return array;
      }),
      mergeMap(array => this.validationObs(array)),
      map(arrays => {
        const result: any = [];
        arrays.forEach(array => {
          array.forEach((item: any) => {
            result.push(item);
          });
        });
        return result;
      })
    );
  }

  getByGoodId(self?: ProceedingsDeliveryReceptionService, goodId?: string) {
    return self.get<IListResponse<IProceedingByGood>>(
      self.endpoint + '/find-good-in-procedings-delivery-reception/' + goodId
    );
  }

  getAll(
    params?: _Params
  ): Observable<IListResponse<IProceedingDeliveryReception>> {
    return this.get<IListResponse<IProceedingDeliveryReception>>(
      this.endpoint,
      params
    );
  }

  update2(item: IProceedingDeliveryReception) {
    return this.put(this.endpoint + '/' + item.id, item);
  }

  getAll2(self?: ProceedingsDeliveryReceptionService, params?: string) {
    return self.get<IListResponse<IProceedingDeliveryReception>>(
      self.endpoint,
      params
    );
  }

  getAllProceedingsDeliveryReception(
    params?: ListParams
  ): Observable<IListResponse<IProceedings>> {
    return this.get<IListResponse<IProceedings>>(
      ProceedingsEndpoints.ProceedingsDeliveryReception,
      params
    );
  }

  getProceedingsByKey(
    id: string | number
  ): Observable<IListResponse<IProceedings>> {
    const route = `${ProceedingsEndpoints.ProceedingsDeliveryReception}?filter.keysProceedings=${id}`;
    return this.get<IListResponse<IProceedings>>(route);
  }

  getAll3(
    params?: string
  ): Observable<IListResponse<IProccedingsDeliveryReception>> {
    const route = `${ProceedingsEndpoints.ProceedingsDeliveryReception}`;
    return this.get<IListResponse<IProccedingsDeliveryReception>>(
      route,
      params
    );
  }

  create(model: IProccedingsDeliveryReception) {
    return this.post(ProceedingsEndpoints.ProceedingsDeliveryReception, model);
  }

  update(id: string | number, model: IProccedingsDeliveryReception) {
    const route = `${ProceedingsEndpoints.ProceedingsDeliveryReception}/${id}`;
    return this.put(route, model);
  }
}

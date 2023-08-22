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
  IListResponseMessage,
  IResponse,
} from '../../interfaces/list-response.interface';
import { IDetailProceedingsDeliveryReception } from '../../models/ms-proceedings/detail-proceeding-delivery-reception';
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

export interface ISucess {
  sucess: string;
}

export interface INotSucess {
  error: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProceedingsDeliveryReceptionService extends HttpService {
  private readonly endpoint = ProceedingsEndpoints.ProceedingsDeliveryReception;
  private readonly endpoint2 = ProceedingsEndpoints.GoStatus;
  private readonly filter = `?.filter.keysProceedings=`;
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

  createMassiveDetail(selecteds?: IDetailProceedingsDeliveryReception[]) {
    return forkJoin(
      selecteds.map(selected => {
        // selected.numberGood
        delete selected.good;
        delete selected.description;
        delete selected.status;
        delete selected.warehouse;
        delete selected.vault;
        return this.createDetail(selected).pipe(
          map(item => {
            return { numberGood: selected.numberGood + '' } as any;
          }),
          catchError(err => of({ error: selected.numberGood + '' } as any))
        );
      })
    );
  }

  createDetail(model: IDetailProceedingsDeliveryReception) {
    return this.post<{
      message: string[];
      data: IDetailProceedingsDeliveryReception;
    }>('detail-proceedings-delivery-reception', model);
  }

  deleteMassiveDetails(
    selecteds?: { numberGood: number; numberProceedings: number }[]
  ) {
    return forkJoin(
      selecteds.map(selected =>
        this.deleteDetail(selected.numberGood, selected.numberProceedings).pipe(
          map(item => {
            return { sucess: selected.numberGood + '' } as ISucess;
          }),
          catchError(err =>
            of({ error: selected.numberGood + '' } as INotSucess)
          )
        )
      )
    );
  }

  deleteDetail(numberGood: number, numberProceedings: number) {
    return this.delete('detail-proceedings-delivery-reception', {
      numberGood,
      numberProceedings,
    });
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
            return { sucess: selected.id } as ISucess;
          }),
          catchError(err => {
            if (err.error.message.includes('detalle_acta_ent_recep')) {
              return of({ error: selected.id } as INotSucess);
            } else {
              return of({ error: null } as INotSucess);
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

  getExcelContinue(data: IProceedingDeliveryReception[]) {
    const array: Observable<any>[] = [];
    if (data && data.length > 0) {
      data.forEach(item => {
        // console.log(item);
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
                    'LOCALIDAD/DICTAMEN': item.numTransfer?.description ?? '',
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
  }

  getExcel2(data: IProceedingDeliveryReception[]) {
    return of(this.getExcelContinue(data)).pipe(
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

  getExcel(filterParams?: FilterParams) {
    const params = new FilterParams(filterParams);
    params.limit = 100000;
    return this.get<IListResponse<IProceedingDeliveryReception>>(
      this.endpoint,
      params.getParams()
    ).pipe(
      map(items => {
        console.log(items);
        // const data = items.data;
        return this.getExcelContinue(items.data);
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
  ): Observable<IListResponseMessage<IProceedingDeliveryReception>> {
    return this.get<IListResponseMessage<IProceedingDeliveryReception>>(
      this.endpoint,
      params
    );
  }

  getById(id: string) {
    return this.get<IProceedingDeliveryReception>(
      this.endpoint + '/getOne/' + id
    );
  }

  getAllFilterDelRec(params: any) {
    return this.get<IListResponse<any>>(this.endpoint, params);
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
    params?: _Params
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

  getByUserAndArea(user: string, area: string) {
    return this.get(
      `${ProceedingsEndpoints.ProceedingsDeliveryReception}/find/user/${user}/area/${area}`
    );
  }
  getStatusDeliveryCveExpendiente(cve: string) {
    const route = `${ProceedingsEndpoints.ProceedingsDeliveryReception}?text.keysProceedings=${cve}`;
    return this.get(route, cve);
  }
  getStatusDeliveryCveExpendienteAll(params?: ListParams) {
    const route = `${ProceedingsEndpoints.ProceedingsDeliveryReception}`;
    return this.get(route, params);
  }
  getAllByActa(
    cve: string,
    fileNumber: number,
    tipe: number
  ): Observable<IListResponse<IProceedingDeliveryReception>> {
    return this.get<IListResponse<IProceedingDeliveryReception>>(
      `${this.endpoint}/proceedings-delivery-reception?text.${cve}&file.filesId=${fileNumber}file.filesId=${fileNumber}`
    );
  }

  getStatusConversion(id: string | number) {
    return this.get(`${this.endpoint2}/${id}`);
  }

  deleteProceedingsDeliveryReception(id?: any) {
    return this.delete(
      `${ProceedingsEndpoints.ProceedingsDeliveryReception}/${id}`
    );
  }

  getProceeding(
    id: number
  ): Observable<IListResponse<IProceedingDeliveryReception>> {
    return this.get<IListResponse<IProceedingDeliveryReception>>(
      `${this.endpoint}?filter.numFile=${id}` //  &filter.typeProceedings='DESTINO'`
    );
  }

  getProceedingByExp(
    id: number
  ): Observable<IListResponse<IProceedingDeliveryReception>> {
    return this.get<IListResponse<IProceedingDeliveryReception>>(
      `${this.endpoint}?filter.numFile=${id}&filter.typeProceedings=DESTINO`
    );
  }

  getDetMinutes(id: number) {
    return this.get(
      `${ProceedingsEndpoints.DetailProceedingsDevollution}?filter.numGoodProceedingsId=${id}`
    );
  }

  getFilterProceeding(id: number | string) {
    return this.get(`${ProceedingsEndpoints.ActasDeliveryReception}/${id}`);
  }

  getFilterProceeding2(id: number | string) {
    return this.get(`${ProceedingsEndpoints.ActasDeliveryReception2}/${id}`);
  }

  //tipo_acta in ('ACIRVEN','ACIRDES','ACIRDEV','ACIRDON','ACIRRES','ACIRSUS')
  getProceeding2(
    id: number
  ): Observable<IListResponse<IProceedingDeliveryReception>> {
    return this.get<IListResponse<IProceedingDeliveryReception>>(
      `${this.endpoint}?filter.numFile=${id}&filter.typeProceedings=$in:ACIRVEN,ACIRDES,ACIRDEV,ACIRDON,ACIRRES,ACIRSUS` //  &filter.typeProceedings='DESTINO'`
    );
  }
}

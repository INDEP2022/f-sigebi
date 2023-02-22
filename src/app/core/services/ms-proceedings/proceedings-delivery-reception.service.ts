import { Injectable } from '@angular/core';
import { forkJoin, map, mergeMap, Observable } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { ProceedingsEndpoints } from '../../../common/constants/endpoints/ms-proceedings-endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IProceedingDeliveryReception } from '../../models/ms-proceedings/proceeding-delivery-reception';
import { ProceedingsDetailDeliveryReceptionService } from './proceedings-detail-delivery-reception.service';

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

  deleteMasive(selecteds: IProceedingDeliveryReception[]) {
    return forkJoin(
      selecteds.map(selected => {
        return this.delete(this.endpoint + '/' + selected.id);
      })
    );
  }

  getExcel(params?: ListParams | string) {
    return this.get<IListResponse<IProceedingDeliveryReception>>(
      this.endpoint,
      params
    ).pipe(
      map(items => {
        const data = items.data;
        const array: Observable<any>[] = [];
        if (data && data.length > 0) {
          data.forEach(item => {
            const paramsDetail = new FilterParams();
            paramsDetail.limit = 100000;
            paramsDetail.addFilter('numberProceedings', item.id);
            array.push(
              this.detailService.getAll(paramsDetail.getParams()).pipe(
                map(details => {
                  const arrayDetails: any[] = [];
                  const dataDetail = details.data;
                  if (dataDetail && dataDetail.length > 0) {
                    dataDetail.forEach(detail => {
                      arrayDetails.push({
                        PROGRAMA: item.keysProceedings,
                        'LOCALIDAD/DICTAMEN': item.numTransfer.description,
                        'NO BIEN': detail.numberGood,
                        ESTATUS: detail.good.status,
                        DESCRIPCION: detail.good.description,
                        'TIPO BIEN': detail.good.goodsCategory,
                        EXPEDIENTE: item.numFile.filesId,
                        EVENTO: detail.numberProceedings,
                        CANTIDAD: detail.amount,
                        FEC_RECEPCION: detail.approvedXAdmon,
                        FEC_FINALIZACION: detail.dateIndicatesUserApproval,
                        INDICADOR_DEST: detail.good.identifier,
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
      mergeMap(obs => forkJoin(...obs)),
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

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IProceedingDeliveryReception>> {
    return this.get<IListResponse<IProceedingDeliveryReception>>(
      this.endpoint,
      params
    ).pipe(
      map(items => {
        return {
          ...items,
          data: items.data.map(item => {
            const nameArray = item.elaborateDetail
              ? item.elaborateDetail['name']
                ? item.elaborateDetail['name'].split(' ')
                : []
              : [];
            let ingreso = '';
            nameArray.forEach(text => {
              ingreso += text.substring(0, 2)
                ? text.substring(0, 2)
                : text.substring(0, 1) ?? '';
            });
            return {
              ...item,
              ingreso,
            };
          }),
        };
      })
    );
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
    const route = `${ProceedingsEndpoints.ProceedingsDeliveryReception}/${id}`;
    return this.get<IListResponse<IProceedings>>(route);
  }
}

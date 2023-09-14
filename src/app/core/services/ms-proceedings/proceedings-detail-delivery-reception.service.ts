import { Injectable } from '@angular/core';
import { catchError, forkJoin, mergeMap, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProceedingsEndpoints } from 'src/app/common/constants/endpoints/ms-proceedings-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import {
  firstFormatDateToSecondFormatDate,
  formatForIsoDate,
  secondFormatDate,
} from 'src/app/shared/utils/date';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITrackedGood } from '../../models/ms-good-tracker/tracked-good.model';
import { IGoodsByProceeding } from '../../models/ms-indicator-goods/ms-indicator-goods-interface';
import { IDetailProceedingsDeliveryReception } from '../../models/ms-proceedings/detail-proceeding-delivery-reception';
import { PBDelete } from '../../models/ms-proceedings/proceeding-aplication.model';
import { INotSucess, ISucess } from './proceedings-delivery-reception.service';

export function trackerGoodToDetailProceeding(
  item: ITrackedGood,
  idProceeding: string
): IDetailProceedingsDeliveryReception {
  return {
    numberProceedings: +idProceeding,
    numberGood: +item.goodNumber,
    amount: 1,
    received: 'S',
    approvedXAdmon: 'S',
    approvedDateXAdmon: secondFormatDate(new Date()),
    approvedUserXAdmon: 'S',
    dateIndicatesUserApproval: secondFormatDate(new Date()),
    numberRegister: 0,
    reviewIndft: 0,
    correctIndft: 0,
    idftUser: null,
    idftDate: new Date(),
    numDelegationIndft: 0,
    yearIndft: 0,
    monthIndft: 0,
    idftDateHc: new Date(),
    packageNumber: 0,
    exchangeValue: 0,
  };
}

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
      case 'CM':
        return item.cve_evento;
      case 'DN':
        return item.cve_dic_donacion;
      default:
        return item.clave_acta_destruccion;
    }
  }

  getDictamenes(data: IGoodsByProceeding) {}

  getGoodByRastrer(goods: number[], action: string, good: IGoodsByProceeding) {
    return this.post<IListResponse<IGoodsByProceeding>>(
      'aplication/get-goods-indicators',
      { goods, action }
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
        console.log(expedientes);
        let bienes = 0;
        const data = items.data.map(item => {
          bienes += +(item.cantidad + '');
          return {
            ...item,
            fec_aprobacion_x_admon: good ? good.fec_aprobacion_x_admon : null,
            fec_indica_usuario_aprobacion: good
              ? good.fec_indica_usuario_aprobacion
              : null,
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
            return { sucess: selected.good.id } as ISucess;
          }),
          catchError(err => of({ error: selected.good.id } as INotSucess))
        );
      })
    );
  }

  deleteMassiveByIds(selecteds?: IDetailProceedingsDeliveryReception[]) {
    return forkJoin(
      selecteds.map(selected =>
        this.deleteById(selected.good.goodId, selected.numberProceedings).pipe(
          map(item => {
            return { sucess: selected.good.goodId } as ISucess;
          }),
          catchError(err => of({ error: selected.good.goodId } as INotSucess))
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

  changeAct(
    details: IDetailProceedingsDeliveryReception[],
    numberProceedings: string
  ) {
    return forkJoin(
      details.map(detail => {
        if (detail.good) {
          delete detail.good;
        }
        if (detail.description !== undefined) delete detail.description;
        if (detail.status !== undefined) delete detail.status;
        if (detail.vault !== undefined) delete detail.vault;
        if (detail.warehouse !== undefined) delete detail.warehouse;

        return this.put(this.endpoint, {
          ...detail,
          approvedDateXAdmon: detail.approvedDateXAdmon
            ? firstFormatDateToSecondFormatDate(detail.approvedDateXAdmon + '')
            : null,
          dateIndicatesUserApproval: detail.dateIndicatesUserApproval
            ? firstFormatDateToSecondFormatDate(
                detail.dateIndicatesUserApproval + ''
              )
            : null,
          numberProceedings,
        });
      })
    );
  }

  updateMassiveNew(
    approvedDateXAdmon: string,
    dateIndicatesUserApproval: string,
    numberProceedings: number
  ) {
    return this.put(
      'aplication/detaProceDeliRecepMinutesNumber/' + numberProceedings,
      {
        approvedDateXAdmon:
          firstFormatDateToSecondFormatDate(approvedDateXAdmon),
        dateIndicatesUserApproval: firstFormatDateToSecondFormatDate(
          dateIndicatesUserApproval
        ),
      }
    );
    // http://sigebimsqa.indep.gob.mx/proceeding/api/v1/aplication/detaProceDeliRecepMinutesNumber/7327
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

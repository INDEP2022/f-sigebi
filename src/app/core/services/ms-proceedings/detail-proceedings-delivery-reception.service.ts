import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProceedingsEndpoints } from 'src/app/common/constants/endpoints/ms-proceedings-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IDeleteDetailProceeding,
  IDetailProceedingsDeliveryReception,
  IDetailWithIndEdo,
} from '../../models/ms-proceedings/detail-proceedings-delivery-reception.model';
@Injectable({
  providedIn: 'root',
})
export class DetailProceeDelRecService extends HttpService {
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
  }

  getGoodsByProceedings(id: string | number, params?: ListParams) {
    const route = `${ProceedingsEndpoints.DetailProceedingsDeliveryReception}?filter.numberProceedings=${id}`;
    return this.get(route, params);
  }

  getGoodsByProceeding(params: HttpParams) {
    const route = `proceedings-delivery-reception`;
    return this.get(route, params);
  }

  PADelActaEntrega(actNumber: string | number) {
    return this.delete(`${ProceedingsEndpoints.PADelActaEntrega}/${actNumber}`);
  }

  editDetailProcee(model: IDetailProceedingsDeliveryReception) {
    return this.put(
      ProceedingsEndpoints.DetailProceedingsDeliveryReception,
      model
    );
  }

  addGoodToProceedings(model: Partial<IDetailProceedingsDeliveryReception>) {
    return this.post(
      ProceedingsEndpoints.DetailProceedingsDeliveryReception,
      model
    );
  }

  deleteDetailProcee(model: IDeleteDetailProceeding) {
    return this.delete(
      ProceedingsEndpoints.DetailProceedingsDeliveryReception,
      model
    );
  }

  getAllFiltered(params: _Params) {
    return this.get<IListResponse<IDetailProceedingsDeliveryReception>>(
      'detail-proceedings-delivery-reception',
      params
    );
  }

  getAllwithEndFisico(model: IDetailWithIndEdo) {
    return this.post(
      'detail-proceedings-delivery-reception/get-detalle-acta-recepcion',
      model
    );
  }

  remove(numberGood: string | number, numberProceedings: string | number) {
    return this.delete('detail-proceedings-delivery-reception', {
      numberGood,
      numberProceedings,
    });
  }

  getReport(report: number) {
    const route = `${ProceedingsEndpoints.GetProcedding}/${report}`;
    return this.get(route);
  }

  getByExpedient(report: number | string) {
    const route = `${ProceedingsEndpoints.GetCustom}?filter.fileNumber.filesId=$eq:${report}`;
    return this.get(route);
  }

  getbyfile(params: any) {
    const route = `${ProceedingsEndpoints.getAct}`;
    return this.post(route, params);
  }

  getProcedingbyId(id: number | string) {
    const route = `${ProceedingsEndpoints.ProeedingsDevolution}/${id}`;
    return this.get(route);
  }
}

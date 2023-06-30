import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import {
  IListResponse,
  IListResponseMessage,
  IResponse,
} from '../../interfaces/list-response.interface';
import {
  IProceedings,
  IUpdateActasEntregaRecepcion,
} from '../../models/ms-proceedings/proceedings.model';
import {
  IBlkPost,
  IUpdateVault,
  IUpdateWarehouse,
} from '../../models/ms-proceedings/warehouse-vault.model';
import { ProceedingsEndpoints } from './../../../common/constants/endpoints/ms-proceedings-endpoints';
import {
  ICveAct,
  IUpdateProceedings,
} from './../../models/ms-proceedings/update-proceedings.model';

@Injectable({
  providedIn: 'root',
})
export class ProceedingsService extends HttpService {
  private readonly route = ProceedingsEndpoints.Proceedings;
  private readonly endpoint = ProceedingsEndpoints.ProeedingsDevolution;
  private readonly endpointU = ProceedingsEndpoints.UpdateActasRDelegation;
  showErrorObs = new BehaviorSubject<boolean>(true);
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
    console.log(' PROCEEDINGS SERVICE CONSTRUCTOR');
  }

  // getAll(params?: ListParams): Observable<IListResponse<IProceedings>> {
  //   return this.get<IListResponse<IProceedings>>(this.endpoint);
  // }
  updateVaultByProceedingNumber(model: IUpdateVault) {
    return this.post<IResponse>(
      `${this.route}/${ProceedingsEndpoints.UpdateVaultByProceedingNumber}`,
      model
    );
  }

  updateVaultByKeyProceeding(model: IUpdateVault) {
    return this.post<IResponse>(
      `${this.route}/${ProceedingsEndpoints.UpdateVaultByKeyProceeding}`,
      model
    );
  }

  updateWarehouseByProceedingNumber(model: IUpdateWarehouse) {
    return this.post<IResponse>(
      `${this.route}/${ProceedingsEndpoints.UpdateWarehouseByProceedingNumber}`,
      model
    );
  }

  updateWarehouseByKeyProceeding(model: IUpdateWarehouse) {
    return this.post<IResponse>(
      `${this.route}/${ProceedingsEndpoints.UpdateWarehouseByKeyProceeding}`,
      model
    );
  }

  getBiePosquery(model: IBlkPost) {
    return this.post<IResponse>(`${ProceedingsEndpoints.blkBienPost}`, model);
  }

  getActByFileNumber(
    fileNumber?: number,
    params?: ListParams
  ): Observable<IListResponse<IProceedings>> {
    return this.get<IListResponse<IProceedings>>(
      `${this.endpoint}?filter.fileNumber=${fileNumber}`,
      params
    );
  }

  update(id: string | number, proceeding: IUpdateProceedings) {
    const route = `${this.endpoint}/${id}`;
    return this.put(route, proceeding);
  }

  getDetailProceedingsDevolutionByExpedient(
    fileNumber: string | number,
    params?: ListParams
  ) {
    return this.get<IListResponse<IProceedings>>(
      `${this.endpoint}?filter.fileNumber=${fileNumber}`
    );
  }

  getProceedings(params?: ListParams): Observable<IListResponse<IProceedings>> {
    return this.get<IListResponse<IProceedings>>(
      `${this.route}/getAll`,
      params
    );
  }

  getExistProceedings(numberGood: string) {
    return this.get<IListResponseMessage<{ existe: number }>>(
      ProceedingsEndpoints.ExistProceedings + '/' + numberGood
    );
  }

  createProceedings(formData: any) {
    return this.post(this.route, formData);
  }

  getCurTrans(expedientId: string | number) {
    return this.get<{
      no_transferente: string;
      clave: string;
    }>(`application/get-cur-transf/${expedientId}`);
  }

  getCveAct(model: ICveAct) {
    return this.post<IResponse>('aplication/get-detail-acta-types', model);
  }

  remove(proceedingsNumb: number) {
    return this.delete<IListResponse<IProceedings>>(
      `${this.endpoint}/${proceedingsNumb}`
    );
  }
  updateActasEntregaRecepcion(
    model: IUpdateActasEntregaRecepcion,
    no_Acta: string | number
  ) {
    return this.put<IListResponse<any>>(
      `aplication/update-actasEntregaRecepcion/${no_Acta}`,
      model
    );
  }

  updateActasEntregaRTurno(body: any) {
    return this.put<IListResponse<any>>(`${this.endpointU}`, body);
  }

  insertsAndUpdatesValmotosOne(model: Object) {
    return this.post<IListResponse>('aplication/get-detail-acta-types', model);
  }

  updateProceeding(model: Object) {
    return this.put(this.route, model);
  }

  deleteProceeding(model: Object) {
    return this.delete(this.route, model);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ParameterComerEndpoints } from '../../../common/constants/endpoints/ms-parametercomer-endpoints';
import { IParameterMod } from '../../models/ms-comer-concepts/parameter-mod.model';
import { IComerEventApp } from '../../models/ms-parametercomer/comer-event-pq.model';
import {
  IParameter,
  ITypeEvent,
} from '../../models/ms-parametercomer/parameter';

@Injectable({
  providedIn: 'root',
})
export class ParameterModService
  extends HttpService
  implements ICrudMethods<IParameter>
{
  private readonly route: string = ParameterComerEndpoints.ParameterMod;
  private readonly routeTypeEvent: string = ENDPOINT_LINKS.tevents;
  constructor(
    private parameterRepository: Repository<IParameter>,
    private typeEventRepository: Repository<ITypeEvent>
  ) {
    super();
    this.microservice = ParameterComerEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IParameter>> {
    return this.get(this.route, params);
  }

  getTypeEvent(params: ListParams) {
    return this.typeEventRepository.getAllPaginated(
      this.routeTypeEvent,
      params
    );
  }

  getById(id: string | number): Observable<IParameter> {
    return this.get(`${this.route}/id/${id}`);
  }

  create(tpenalty: Partial<IParameter>): Observable<IParameter> {
    return this.post(this.route, tpenalty);
  }

  update(id: string, tpenalty: Partial<IParameter>): Observable<Object> {
    return this.put(`${this.route}/id/${id}`, tpenalty);
  }

  updateNew(tpenalty: IParameter): Observable<Object> {
    return this.put(`${this.route}`, tpenalty);
  }

  remove(id: string | number) {
    const route = `${this.route}/id/${id}`;
    return this.delete(route);
  }

  newRemove(model: IParameter) {
    const route = `${this.route}`;
    return this.delete(route, model);
  }

  validUser(data: { user: string }) {
    return this.post(ParameterComerEndpoints.ApplicationUser, data);
  }

  //COMER_PARAMETROSMOD
  getParamterMod(params?: any) {
    return this.get<IListResponse<IParameterMod>>(`parameters-mod`, params);
  }

  //COMER_STATUS_VTA
  getParameterStatus(params?: string) {
    return this.get(`comer-status-vta`, params);
  }

  getAsigna(user: string, adress: string) {
    return this.get(
      `${ParameterComerEndpoints.ApplicationSigna}?user=${user}&address=${adress}`
    );
  }

  getComerEvent(body: {
    direction: 'M' | 'I';
    eventId: string | number;
    cveDisplay: string;
  }) {
    return this.post<IComerEventApp>('aplication/comer-events-post-query', {
      ...body,
      tpEventId: '1',
      statusVtaId: '1',
      tpSolaValId: '1',
    });
  }

  getComerEventGoods(
    body: {
      eventId: string | number;
      direction: string;
      pProcess?: string;
    },
    params: _Params
  ) {
    return this.post<IListResponse>(
      'aplication/goods-post-query',
      body,
      params
    );
  }

  getComerEventGoodsFormat(
    body: {
      eventId: string | number;
      direction: string;
      pProcess?: string;
    },
    params: _Params
  ) {
    return this.post<{ base64: string }>(
      'aplication/goods-post-query-excel',
      body,
      params
    );
  }

  getComerEventAppraisal(
    body: {
      eventId: string | number;
      direction: string;
    },
    params: _Params
  ) {
    return this.post<IListResponse>('aplication/pup-consult', body, params);
  }

  getComerEventAppraisalDetail(appraisalId: string | number, params: _Params) {
    return this.post<IListResponse>(
      `aplication/comer-detavaluo-post-query/${appraisalId}`,
      {},
      params
    );
  }

  validDisscountFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.post<IListResponse<{ NO_BIEN: string; CAUSA: string }>>(
      'aplication/pup-valid-arch-desc',
      formData
    );
  }

  pufValService(body: {
    cveDisplay: string;
    pProcess: string;
    pEvent: string | number;
    pTpevent: string | number;
    pCveAppraisal: string;
    pDirection: string;
    ptpoAvalue: string | number;
    pTpodocument: string | number;
    pEstevent: string | number;
  }) {
    return this.post<string | { data: string }>(
      'aplication/puf-val-event',
      body
    );
  }

  applyDisscount(
    body: {
      cveDisplay: string;
      pProcess: string;
      pEvent: string | number;
      pTpevent: string | number;
      pCveAppraisal: string;
      pDirection: string;
      ptpoAvalue: string | number;
      pTpodocument: string | number;
      pEstevent: string | number;
    },
    file: File
  ) {
    const formData = new FormData();
    formData.append('cveDisplay', body.cveDisplay);
    formData.append('pProcess', body.pProcess);
    formData.append('pEvent', body.pEvent as string);
    formData.append('pTpevent', body.pTpevent as string);
    formData.append('pCveAppraisal', body.pCveAppraisal);
    formData.append('pDirection', body.pDirection);
    formData.append('ptpoAvalue', body.ptpoAvalue as string);
    formData.append('pTpodocument', body.pTpodocument as string);
    formData.append('pEstevent', body.pEstevent as string);
    formData.append('file', file);
    return this.post(
      'aplication/blkcontrol-img-aplica-desctos-when-image-pressed',
      formData
    );
  }

  f_validUser(data: any) {
    // F_VALIDA_USUARIO
    return this.post(ParameterComerEndpoints.ParameterMod + '/find-one', data);
  }
}

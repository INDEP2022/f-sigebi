import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DictationEndpoints } from 'src/app/common/constants/endpoints/ms-dictation-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  ICopiesOfficeSendDictation,
  IDictation,
  IDictationCopies,
  IInitFormLegalOpinionOfficeBody,
  IInitFormLegalOpinionOfficeResponse,
} from '../../models/ms-dictation/dictation-model';
@Injectable({
  providedIn: 'root',
})
export class DictationService extends HttpService {
  private readonly route = DictationEndpoints;
  constructor() {
    super();
    this.microservice = DictationEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IDictation>> {
    return this.get<IListResponse<IDictation>>(
      DictationEndpoints.Dictation,
      params
    );
  }

  getDictationByGood(id: string | number) {
    const filter = `?page=1&filters[0]={"property":"no_bien","comparison":"EQUAL","value":"3182885"}`;
    const route = `${DictationEndpoints.DictationXGood1}?page=1&filters[0]={"property":"no_bien","comparison":"EQUAL","value":"${id}"}`;
    return this.get(route);
  }

  getAllWithFilters(params?: string): Observable<IListResponse<IDictation>> {
    return this.get<IListResponse<IDictation>>(this.route.Dictation, params);
  }

  getById(body: {
    id: string | number;
    typeDict?: string;
  }): Observable<IDictation> {
    return this.get(this.route.Dictation, body);
  }

  findByIds(body: {
    id: string | number;
    typeDict?: string | number;
  }): Observable<IDictation> {
    return this.post(this.route.FindByIds, body);
  }

  create(body: IDictation) {
    return this.post(this.route.Dictation, body);
  }

  update(body: Partial<IDictation>) {
    return this.put(this.route.Dictation, body);
  }

  remove(body: { id: string | number; typeDict: string }) {
    return this.delete(this.route.Dictation, body);
  }
  postValidationGoodAvailable(model: Object) {
    const route = `${DictationEndpoints.ValidationGoodAvailable}`;
    return this.post(route, model);
  }
  getParamsOfTypeGood(model: Object) {
    const route = `${DictationEndpoints.getParamsOfTypeGood}`;
    return this.post(route, model);
  }

  //***********************************************************/
  findByIdsOficNum(param: _Params) {
    return this.get<IListResponse<IDictation>>(this.route.Dictation, param);
  }

  findUserByOficNum(param: _Params) {
    return this.get<IListResponse<IDictationCopies>>(
      this.route.CopiesOfficialOpinion,
      param
    );
  }

  getInitFormDictation(
    body: IInitFormLegalOpinionOfficeBody
  ): Observable<IListResponse<IInitFormLegalOpinionOfficeResponse>> {
    return this.post<IListResponse<IInitFormLegalOpinionOfficeResponse>>(
      DictationEndpoints.InitFormLegalOpinionOffice,
      body
    );
  }

  getInitFormDictation2(
    body: IInitFormLegalOpinionOfficeBody
  ): Observable<IListResponse<IInitFormLegalOpinionOfficeResponse>> {
    return this.post<IListResponse<IInitFormLegalOpinionOfficeResponse>>(
      DictationEndpoints.InitFormLegalOpinionOffice2,
      body
    );
  }

  getCopiesOfficeSendDictation(
    body: ICopiesOfficeSendDictation
  ): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      DictationEndpoints.CopiesOfficeSendDictation,
      body
    );
  }

  postCargaMasDesahogob(body: any) {
    const route = `${DictationEndpoints.CargaMasDesahogob}`;
    return this.post(route, body);
  }

  postFindGoodDictGood1(body: {
    NO_OF_DICTA: any;
    TIPO_DICTAMINACION: string;
  }) {
    const route = `${DictationEndpoints.FindGoodDictGood1}`;
    return this.post(route, body);
  }

  getDocumentsForDictation(body: {
    id: string | number;
  }): Observable<IDictation> {
    return this.get(this.route.DocumentByDictation, body);
  }

  updateByIdDictament(objParam: any) {
    return this.put<IListResponse<IDictation>>(this.route.Dictation, objParam);
  }
}

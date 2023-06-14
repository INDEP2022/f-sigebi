import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
  IPufGenerateKey,
  IPupLaunchReport,
  IStatusChange,
  ITmpDictationCreate,
  ITmpExpDesahogoB,
} from '../../models/ms-dictation/dictation-model';
import { IRTdictaAarusr } from '../../models/ms-dictation/r-tdicta-aarusr.model';

@Injectable({
  providedIn: 'root',
})
export class DictationService extends HttpService {
  public clasifGoodNumber: number | string;
  public goodNumber: number | string;
  public typeDictamination: any;
  public crime: any;
  public numberClassifyGood: any;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  private readonly route = DictationEndpoints;
  private readonly routeN = DictationEndpoints.DictamenDelegation;

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

  getAllWithFilters(params?: any): Observable<IListResponse<IDictation>> {
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

  createPersonExt(body: IDictationCopies) {
    return this.post(this.route.CopiesOfficialOpinion, body);
  }

  update(body: Partial<IDictation>) {
    return this.put(this.route.Dictation, body);
  }

  updateExpedientNumber(id: number, body: Partial<IDictation>) {
    return this.put(this.route.Dictation + '/' + id, body);
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

  updateUserByOficNum(body: any) {
    return this.put<IListResponse<IDictationCopies>>(
      this.route.CopiesOfficialOpinion,
      body
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

  getDocumentsForDictation(
    id: string | number
  ): Observable<IListResponse<any>> {
    const route = `r-dictation-doc?filter.numberClassifyGood=$eq:${id}`;
    return this.get(route);
  }

  updateByIdDictament(objParam: any) {
    return this.put<IListResponse<IDictation>>(this.route.Dictation, objParam);
  }

  postFindDescriptionOpinion(body: _Params) {
    return this.post<IListResponse<{ dictamen: number; descripcion: string }>>(
      this.route.FindDescriptionOpinion,
      body
    );
  }
  getUpdateDelgationDicta(body: _Params) {
    return this.put<
      IListResponse<{ dictamen: number; delegation_dicta: number }>
    >(this.route.Dictation, body);
  }

  getRTdictaAarusr(
    params?: _Params
  ): Observable<IListResponse<IRTdictaAarusr>> {
    return this.get<IListResponse<any>>(
      DictationEndpoints.RTdictaAarusr,
      params
    );
  }

  deleteCopiesOfficialOpinion(params: IDictationCopies) {
    return this.delete<IListResponse<IDictationCopies>>(
      this.route.CopiesOfficialOpinion,
      params
    );
  }

  createTmpDictation(body: ITmpDictationCreate) {
    return this.post(DictationEndpoints.TmpDictation, body);
  }

  deleteTmpDictation(id: number) {
    return this.delete(`${DictationEndpoints.TmpDictation}/${id}`);
  }

  createTmpExpDesahogoB(body: ITmpExpDesahogoB) {
    return this.post(DictationEndpoints.TmpExpDesahogoB, body);
  }

  sendGetOfficeByYear(body: Object) {
    const route = `${DictationEndpoints.GetOfficeByYear}`;
    return this.post(route, body);
  }

  sendGetOfficeByYear2(body: Object) {
    const route = `${DictationEndpoints.GetOfficeByYear_}`;
    return this.post(route, body);
  }

  sendConsulta1(anio: string, delegation: any) {
    const route = `${DictationEndpoints.GetOfficeByYear1}`;
    return this.get(route + `/${anio}?delegationDictamNumber=${delegation}`);
  }

  sendConsulta2(anio: string, delegation: any) {
    const route = `${DictationEndpoints.GetOfficeByYear2}`;
    return this.get(route + `/${anio}?delegationDictamNumber=${delegation}`);
  }

  sendConsulta3(anio: string, delegation: any) {
    const route = `${DictationEndpoints.GetOfficeByYear3}`;
    return this.get(route + `/${anio}?delegationDictamNumber=${delegation}`);
  }

  getFaFlagDest(params: any) {
    const route = `${DictationEndpoints.FaFlagDest}`;
    return this.post(route, params);
  }

  updateOfficialDictation(params: any) {
    const route = `${DictationEndpoints.OfficialDictation}`;
    return this.put(route, params);
  }

  createOfficialDictation(params: any) {
    const route = `${DictationEndpoints.OfficialDictation}`;
    return this.post(route, params);
  }

  deleteCopiesdictamenetOfficialOpinion(obj: any) {
    return this.delete<IListResponse<IDictationCopies>>(
      this.route.CopiesOfficialOpinion,
      obj
    );
  }
  updateDictaEntregaRTurno(body: any) {
    return this.put<IListResponse<any>>(`${this.routeN}`, body);
  }

  deletePupDeleteDictum(params: any) {
    const route = `${DictationEndpoints.DeletePupDeleteDictum}`;
    return this.post(route, params);
  }

  checkGoodAvaliable(data: Object) {
    return this.post(DictationEndpoints.Check, data);
  }
  getFactjurdictamasg(typeDict: any) {
    const route = `${DictationEndpoints.FactJur}`;
    return this.get(route + `/${typeDict}`);
  }

  getNoGoodClass(data: Object) {
    return this.post(DictationEndpoints.GetGoodClass, data);
  }

  //eliminar dictattion condiciones
  getVElimina(user: string) {
    return this.get(`${DictationEndpoints.DEl1}?usuario=${user}`);
  }

  getValid(data: Object) {
    return this.post(DictationEndpoints.DEL2, data);
  }

  getVExist(data: Object) {
    return this.post(DictationEndpoints.DEL3, data);
  }

  getStatusIni(good: number) {
    return this.get(`${DictationEndpoints.DEL4}?noBien=${good}`);
  }

  updateVEstatus(data: Object) {
    return this.put(DictationEndpoints.DEL5, data);
  }

  getVEstatus(data: Object) {
    return this.post(DictationEndpoints.DEL6, data);
  }

  getUpdateAndDelete(data: Object) {
    return this.post(DictationEndpoints.DEL7, data);
  }

  pupLaunchReport(data: Object) {
    return this.post<IListResponse<IPupLaunchReport>>(
      DictationEndpoints.ApplicationLaunchReport,
      data
    );
  }

  getVOficTrans(data: Object) {
    return this.post<IListResponse<any>>(
      DictationEndpoints.ApplicationGetVOficTrans,
      data
    );
  }
  nUniversalFolio(data: Object) {
    return this.post<IListResponse<any>>(
      DictationEndpoints.ApplicationNUniversalFolio,
      data
    );
  }
  getActnom(managementNumber: number) {
    return this.get<IListResponse<any>>(
      DictationEndpoints.ApplicationGetActnom + '/' + managementNumber
    );
  }
  pupValidExtDom(wheelNumber: number) {
    return this.get<IListResponse<any>>(
      DictationEndpoints.ApplicationPupValidExtDom + '/' + wheelNumber
    );
  }
  updateManagerTransfer(data: Object) {
    return this.post<IListResponse<any>>(
      DictationEndpoints.ApplicationUpdateManagerTransfer,
      data
    );
  }
  findOffficeNu(data: Object) {
    return this.post<IListResponse<any>>(
      DictationEndpoints.ApplicationFindOffficeNu,
      data
    );
  }
  pufGenerateKey(params: IPufGenerateKey) {
    return this.post<IListResponse<any>>(
      DictationEndpoints.ApplicationPufGenerateKey,
      params
    );
  }
  pupStatusChange(params: IStatusChange) {
    return this.post<IListResponse<any>>(
      DictationEndpoints.ApplicationPupCambiaEstatus,
      params
    );
  }
}

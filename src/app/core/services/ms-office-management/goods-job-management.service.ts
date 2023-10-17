import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoodsJobManagementEndpoints } from 'src/app/common/constants/endpoints/officemanagement/ms-goods-jog-management-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGood } from '../../models/ms-good/good';
import {
  ICopiesJobManagementDto,
  IGoodJobManagement,
  IGoodJobManagementByIds,
  ImanagementOffice,
} from '../../models/ms-officemanagement/good-job-management.model';
@Injectable({
  providedIn: 'root',
})
export class GoodsJobManagementService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodsJobManagementEndpoints.OfficeManagement;
  }

  getAllFiltered(params: _Params) {
    return this.get<IListResponse<IGoodJobManagement>>(
      GoodsJobManagementEndpoints.GoodsJobManagement,
      params
    );
  }

  findByIds(body: IGoodJobManagementByIds) {
    return this.post<IListResponse<IGoodJobManagementByIds>>(
      GoodsJobManagementEndpoints.FindByIds,
      body
    );
  }

  // => Oficce Documents
  getAllOfficialDocument(params: _Params) {
    return this.get<IListResponse<ImanagementOffice>>(
      GoodsJobManagementEndpoints.mJobManagement,
      params
    );
  }

  getPersonaExt_Int(params: _Params) {
    console.log('getPersonaExt_Int(params: _Params) SERVICES ' + params);
    return this.get<IListResponse<ICopiesJobManagementDto>>(
      GoodsJobManagementEndpoints.OfficeManagementCopies,
      params
    );
  }

  updateOficio(body: any) {
    return this.put<IListResponse<ImanagementOffice>>(
      GoodsJobManagementEndpoints.mJobManagement,
      body
    );
  }

  getCopiesJobManagement(params: ListParams) {
    return this.get<IListResponse<any>>(
      GoodsJobManagementEndpoints.OfficeManagementCopies,
      params
    );
  }

  deleteCopiesJobManagement(params: any) {
    return this.delete<IListResponse<any>>(
      GoodsJobManagementEndpoints.OfficeManagementCopies + `/${params}`
    );
  }

  createCopiesJobManagement(obj: any) {
    return this.post<IListResponse<any>>(
      GoodsJobManagementEndpoints.OfficeManagementCopies,
      obj
    );
  }

  getGoodsJobManagement(list?: ListParams): Observable<
    IListResponse<{
      managementNumber: string;
      goodNumber: IGood;
      recordNumber: string;
    }>
  > {
    return this.get<IListResponse<any>>(`goods-job-management`, list);
  }

  postGoodsJobManagement(obj: {
    managementNumber: string;
    goodNumber: number | string;
    recordNumber: string;
  }) {
    return this.post<IListResponse<any>>(`goods-job-management`, obj);
  }

  getMJobManagement(proceedingsNumber: any) {
    const route = `${GoodsJobManagementEndpoints.mJobManagement}?filter.managementNumber=$eq:${proceedingsNumber}`;
    return this.get(route);
  }

  getSeq() {
    return this.get(GoodsJobManagementEndpoints.nextval);
  }

  postJobManagement(params: any) {
    const route = `${GoodsJobManagementEndpoints.goodsManagement}`;
    return this.post(route, params);
  }

  postDocumentJobManagement(params: any) {
    const route = `${GoodsJobManagementEndpoints.documentJobMan}`;
    return this.post(route, params);
  }

  postOficeJobManagement(params: any) {
    const route = `${GoodsJobManagementEndpoints.copiesJobMana}`;
    return this.post(route, params);
  }

  getMJobJuridica3(proceedingsNumber: any) {
    const route = `${GoodsJobManagementEndpoints.mJobManagement}?filter.managementNumber=$eq:${proceedingsNumber}&filter.problematiclegal=$ilike:juridica 3`;
    return this.get(route);
  }

  getMJobJuridica4(proceedingsNumber: any) {
    const route = `${GoodsJobManagementEndpoints.mJobManagement}?filter.managementNumber=$eq:${proceedingsNumber}&filter.problematiclegal=$ilike:juridica 4`;
    return this.get(route);
  }

  deleteOficeJobManagement(params: any) {
    const route = `${GoodsJobManagementEndpoints.goodsManagement}`;
    return this.delete(route, params);
  }

  deleteCopiesJob(id: any) {
    const route = `${GoodsJobManagementEndpoints.copiesJobMana}/${id}`;
    return this.delete(route);
  }

  deleteDocumentJob(params: any) {
    const route = `${GoodsJobManagementEndpoints.documentJobMan}`;
    return this.delete(route, params);
  }

  deleteMJobManagement(params: any) {
    const route = `${GoodsJobManagementEndpoints.mJobManagement}`;
    return this.delete(route, params);
  }

  updateMJobManagement(params: any) {
    const route = `${GoodsJobManagementEndpoints.updateMJob}`;
    return this.post(route, params);
  }

  getblokOffice1(good: any) {
    const route = `${GoodsJobManagementEndpoints.blockOfficel}/${good}`;
    return this.get(route);
  }

  getOficeJobManagementbyGood(good: any) {
    const route = `${GoodsJobManagementEndpoints.getallV2}?filter.goods.goodId=$eq:${good}`;
    return this.get(route);
  }

  getMJobJobManagement(managementNumber: any) {
    const route = `${GoodsJobManagementEndpoints.mJobManagement}?filter.refersTo=$ilike:OFCOMER&filter.managementNumber=$eq:${managementNumber}`;
    return this.get(route);
  }

  getAllFilteredV2(params: _Params) {
    return this.get<IListResponse<IGoodJobManagement>>(
      GoodsJobManagementEndpoints.getallV2,
      params
    );
  }

  pupSearchNumber(params: any) {
    const route = `${GoodsJobManagementEndpoints.pupSearchNumber}`;
    return this.post(route, params);
  }

  postMJob(params: any) {
    const route = `${GoodsJobManagementEndpoints.mJobManagement}`;
    return this.post(route, params);
  }
}

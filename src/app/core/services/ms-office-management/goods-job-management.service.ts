import { Injectable } from '@angular/core';
import { GoodsJobManagementEndpoints } from 'src/app/common/constants/endpoints/officemanagement/ms-goods-jog-management-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
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
}

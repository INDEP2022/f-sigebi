import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoverExpedientEndpoints } from 'src/app/common/constants/endpoints/ms-cover-expedient-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  ICompleteDisposition,
  IDispositionCoverExpedient,
  IFileCoverExpedient,
  IUnitCoverExpedient,
  IUserCoverExpedient,
} from '../../models/ms-cover-expedient/cover-expedient';

@Injectable({
  providedIn: 'root',
})
export class CoverExpedientService extends HttpService {
  constructor() {
    super();
    this.microservice = CoverExpedientEndpoints.Expedient;
  }

  getUsers(
    params?: ListParams | string
  ): Observable<IListResponse<IUserCoverExpedient>> {
    return this.get<IListResponse<IUserCoverExpedient>>(
      CoverExpedientEndpoints.Users,
      params
    );
  }

  getUnits(
    userId: number | string
  ): Observable<IListResponse<IUnitCoverExpedient>> {
    return this.get<IListResponse<IUnitCoverExpedient>>(
      `${CoverExpedientEndpoints.Unit}/${userId}`
    );
  }

  getFiles(
    unitId: number | string,
    userId: number | string
  ): Observable<IListResponse<IFileCoverExpedient>> {
    return this.get<IListResponse<IFileCoverExpedient>>(
      `${CoverExpedientEndpoints.File}/${unitId}/${userId}`
    );
  }

  getDisposition(
    params?: ListParams | string
  ): Observable<IListResponse<IDispositionCoverExpedient>> {
    return this.get<IListResponse<IDispositionCoverExpedient>>(
      CoverExpedientEndpoints.Disposition,
      params
    );
  }

  getCompleteDisposition(
    ddcId: number | string
  ): Observable<ICompleteDisposition> {
    return this.get<ICompleteDisposition>(
      `${CoverExpedientEndpoints.CompleteDisposition}/${ddcId}`
    );
  }

  insertExpedient(body: Object): Observable<any> {
    return this.post<any>(`${CoverExpedientEndpoints.InsertExpedient}`, body);
  }
}

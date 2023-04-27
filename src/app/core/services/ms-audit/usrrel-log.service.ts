import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditEndpoints } from 'src/app/common/constants/endpoints/ms-audit-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IUsrRelBitacora } from '../../models/ms-audit/usr-rel-bitacora.model';

@Injectable({
  providedIn: 'root',
})
export class UsrRelLogService extends HttpService {
  constructor() {
    super();
    this.microservice = AuditEndpoints.BasePath;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IUsrRelBitacora>> {
    return this.get<IListResponse<IUsrRelBitacora>>(
      AuditEndpoints.UsrRelLog,
      params
    );
  }

  getById(id: string | number) {
    const route = `${AuditEndpoints.UsrRelLog}/${id}`;
    return this.get<IUsrRelBitacora>(route);
  }

  create(data: IUsrRelBitacora) {
    return this.post(AuditEndpoints.UsrRelLog, data);
  }

  update(id: string | number, data: IUsrRelBitacora) {
    const route = `${AuditEndpoints.UsrRelLog}/${id}`;
    return this.put(route, data);
  }

  remove(id: string | number) {
    const route = `${AuditEndpoints.UsrRelLog}/${id}`;
    return this.delete(route);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InterfacefgrEndPoints } from 'src/app/common/constants/endpoints/ms-interfacefgr-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IPgrTransfer } from '../../models/ms-interfacefgr/ms-interfacefgr.interface';

@Injectable({
  providedIn: 'root',
})
export class InterfacefgrService extends HttpService {
  constructor() {
    super();
    this.microservice = InterfacefgrEndPoints.Interfacefgr;
  }

  getPgrTransfer(params?: ListParams): Observable<IListResponse<IPgrTransfer>> {
    return this.get<IListResponse<IPgrTransfer>>(
      InterfacefgrEndPoints.PgrTransfer,
      params
    );
  }
}

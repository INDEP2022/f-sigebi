import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DepositaryEndPoints } from 'src/app/common/constants/endpoints/ms-depositary-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IAppointmentDepositary,
  IRequestDepositary,
} from '../../models/ms-depositary/ms-depositary.interface';

@Injectable({
  providedIn: 'root',
})
export class MsDepositaryService extends HttpService {
  constructor() {
    super();
    this.microservice = DepositaryEndPoints.Depositary;
  }

  getGoodAppointmentDepositaryByNoGood(
    params?: ListParams
  ): Observable<IListResponse<IAppointmentDepositary>> {
    return this.get<IListResponse<IAppointmentDepositary>>(
      DepositaryEndPoints.DepositaryAppointment,
      params
    );
  }

  getRequestDepositary(
    params?: ListParams
  ): Observable<IListResponse<IRequestDepositary>> {
    return this.get<IListResponse<IRequestDepositary>>(
      DepositaryEndPoints.DepositaryRequest,
      params
    );
  }
}

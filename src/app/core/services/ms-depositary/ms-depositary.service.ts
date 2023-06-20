import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DepositaryEndPoints } from 'src/app/common/constants/endpoints/ms-depositary-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IAppointmentDepositary,
  IDepositaryAppointments,
  IDepositaryPaymentDet,
  IPaymendtDepParamsDep,
  IPersonsModDepositary,
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

  getAllFiltered(
    params?: _Params
  ): Observable<IListResponse<IAppointmentDepositary>> {
    return this.get<IListResponse<IAppointmentDepositary>>(
      DepositaryEndPoints.DepositaryAppointment,
      params
    );
  }

  getGoodAppointmentDepositaryByNoGood(
    params?: ListParams | string
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

  getAppointments(
    params?: ListParams
  ): Observable<IListResponse<IDepositaryAppointments>> {
    return this.get<IListResponse<IDepositaryAppointments>>(
      DepositaryEndPoints.DepositaryAppointments,
      params
    );
  }

  getPersonsModDepositary(
    params?: _Params
  ): Observable<IListResponse<IPersonsModDepositary>> {
    return this.get<IListResponse<IPersonsModDepositary>>(
      DepositaryEndPoints.PersonsModDepositary,
      params
    );
  }

  getPaymentRefParamsDep(
    params: IPaymendtDepParamsDep
  ): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      DepositaryEndPoints.PaymentRefParamsDep,
      params
    );
  }
  getPaymentRefValidDep(params: any): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      DepositaryEndPoints.PaymentRefValidDep,
      params
    );
  }
  deletePaymentRefRemove(params: any): Observable<IListResponse<any>> {
    return this.delete<IListResponse<any>>(
      DepositaryEndPoints.RemovePaymentRefRemove,
      params
    );
  }
  getPaymentRefPrepOI(params: any): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      DepositaryEndPoints.PaymentRefPrepOI,
      params
    );
  }
  getValidBlackListAppointment(id?: number): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(
      `${DepositaryEndPoints.ValidBlackListAppointment}/${id}`
    );
  }
  getAplicationcargaCliente1(
    no_appointment?: number
  ): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(
      `${DepositaryEndPoints.AplicationcargaCliente1}?no_nombramiento=${no_appointment}`
    );
  }
  getAplicationcargaCliente2(
    no_appointment?: number
  ): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(
      `${DepositaryEndPoints.AplicationcargaCliente2}?no_nombramiento=${no_appointment}`
    );
  }

  getAllFilteredDepositaryPaymentDet(
    params?: _Params
  ): Observable<IListResponse<IDepositaryPaymentDet>> {
    return this.get<IListResponse<IDepositaryPaymentDet>>(
      DepositaryEndPoints.DepositaryPaymentDetail,
      params
    );
  }
}

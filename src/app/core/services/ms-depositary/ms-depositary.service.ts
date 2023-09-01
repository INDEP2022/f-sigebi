import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DepositaryEndPoints } from 'src/app/common/constants/endpoints/ms-depositary-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IAppointmentDepositary,
  IDepositaryAppointments,
  IDepositaryAppointments_custom,
  IDepositaryPaymentDet,
  IInfoDepositary,
  IPaymendtDepParamsDep,
  IPersonsModDepositary,
  IRequestDepositary,
  IVChecaPost,
  IVChecaPostReport,
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

  create(body: Partial<IAppointmentDepositary>) {
    return this.post<IListResponse<IAppointmentDepositary>>(
      DepositaryEndPoints.DepositaryAppointment,
      body
    );
  }

  update(body: Partial<IAppointmentDepositary>) {
    return this.put<IListResponse<IAppointmentDepositary>>(
      DepositaryEndPoints.DepositaryAppointment,
      body
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

  createDepositaryAppointments(body: Partial<IDepositaryAppointments>) {
    return this.post<IListResponse<IDepositaryAppointments>>(
      DepositaryEndPoints.DepositaryAppointments,
      body
    );
  }

  updateDepositaryAppointments(body: Partial<IDepositaryAppointments>) {
    return this.put<IListResponse<IDepositaryAppointments>>(
      DepositaryEndPoints.DepositaryAppointments,
      body
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

  createPersonsModDepositary(body: Partial<IPersonsModDepositary>) {
    return this.post<IListResponse<IPersonsModDepositary>>(
      DepositaryEndPoints.PersonsModDepositary,
      body
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

  getAllFilteredDedPay(
    params?: _Params
  ): Observable<IListResponse<IDepositaryPaymentDet>> {
    return this.get<IListResponse<IDepositaryPaymentDet>>(
      DepositaryEndPoints.DepositaryDedPay,
      params
    );
  }
  getAllFilteredDepositaryDetrepo(
    params?: _Params
  ): Observable<IListResponse<IDepositaryPaymentDet>> {
    return this.get<IListResponse<IDepositaryPaymentDet>>(
      DepositaryEndPoints.DepositaryDetrepo,
      params
    );
  }
  getInfoDepositary(
    params?: _Params
  ): Observable<IListResponse<IInfoDepositary>> {
    return this.get<IListResponse<IInfoDepositary>>(
      DepositaryEndPoints.InfoDepositary,
      params
    );
  }

  putInfoDepositary(
    model: IInfoDepositary
  ): Observable<IListResponse<IInfoDepositary>> {
    return this.put<IListResponse<IInfoDepositary>>(
      DepositaryEndPoints.InfoDepositary,
      model
    );
  }

  getAllFilteredFactJurRegDestLeg(
    params?: _Params
  ): Observable<IListResponse<IDepositaryAppointments_custom>> {
    return this.get<IListResponse<IDepositaryAppointments_custom>>(
      DepositaryEndPoints.FactJurRegDestLeg,
      params
    );
  }
  getAppointmentNumber_PBAplica(
    id?: number
  ): Observable<IListResponse<{ no_nombramiento: string }>> {
    return this.get<IListResponse<{ no_nombramiento: string }>>(
      `${DepositaryEndPoints.ApplicationAppointmentNumber}/${id}`
    );
  }
  getVCheca(cvePayConcept?: number): Observable<IListResponse<any>> {
    return this.get<IListResponse<{ v_checa: number }>>(
      `${DepositaryEndPoints.ApplicationVCheca}/${cvePayConcept}`
    );
  }
  getVChecaPost(
    params: IVChecaPost
  ): Observable<IListResponse<{ v_checa: number }>> {
    return this.post<IListResponse<{ v_checa: number }>>(
      DepositaryEndPoints.ApplicationVChecaPost,
      params
    );
  }
  getVChecaPostReport(
    params: IVChecaPostReport
  ): Observable<IListResponse<{ v_checa: number }>> {
    return this.post<IListResponse<{ v_checa: number }>>(
      DepositaryEndPoints.ApplicationVChecaPostReport,
      params
    );
  }

  // ---------------------------------------------------------------------------------------- //
  VALIDA_PAGOSREF_PREP_OI_BASES_CA(body: any) {
    return this.post(`${DepositaryEndPoints.PaymentRefPrepOiBaseCa}`, body);
  }

  VALIDA_ESTATUS(body: any) {
    return this.post(`${DepositaryEndPoints.ValidateStatus}`, body);
  }

  VALIDA_PAGOSREF_VALIDA_COMER(body: any) {
    return this.post(`${DepositaryEndPoints.PaymentRefValidComer}`, body);
  }

  VALIDA_PAGOSREF_PREP_OI(body: any) {
    return this.post(`${DepositaryEndPoints.PrepOiBaseCa}`, body);
  }

  VALIDA_PAGOSREF_VENTA_SBM(body: any) {
    return this.post(`${DepositaryEndPoints.PaymentRefVentaSbm}`, body);
  }

  MODIFICA_ESTATUS_BASES_ANT(body: any) {
    return this.put(`${DepositaryEndPoints.UpdateStatusBase}/${body}`);
  }

  MODIFICA_ESTATUS_ANT(body: any) {
    return this.put(`${DepositaryEndPoints.UpdateGeneralStatus}`, body);
  }

  postSearchPay(params: any) {
    return this.post(DepositaryEndPoints.SearchPayment, params);
  }

  getPaymentChange(process: number, action: number) {
    return this.get(
      `${DepositaryEndPoints.GetPaymentChange}/${process}/type/${action}`
    );
  }

  postPaymentEfeDup(params: any) {
    return this.post(DepositaryEndPoints.PaymentEfeDup, params);
  }

  getPaymentFile(searchId: any, action: number) {
    return this.get(
      `${DepositaryEndPoints.PaymentFiles}/${searchId}/type/${action}`
    );
  }

  getPaymentBulk(process: string, action: number) {
    return this.get(
      `${DepositaryEndPoints.PaymentBulk}/${process}/type/${action}`
    );
  }

  getSearchPaymentProcess(idSearch: number, newSearch: number) {
    return this.get(
      `${DepositaryEndPoints.SearchPaymentProcess}/search/${idSearch}/new/${newSearch}`
    );
  }

  getComerPaymentSelect(multiple: number, idSearch: any) {
    return this.get(
      `${DepositaryEndPoints.ComerPaymentSelect}/${multiple}/type/${idSearch}`
    );
  }

  getComerDetLcGrief(reference: number | string) {
    return this.get(`application/comer-det-lc-grief/${reference}`);
  }
}

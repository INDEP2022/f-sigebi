import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountmvmntEndpoint } from 'src/app/common/constants/endpoints/accountmvmnt-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import {
  ICuentaDelete,
  ICuentaInsert,
} from 'src/app/core/models/catalogs/bank-modelo-type-cuentas';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IAccountBank } from '../../models/catalogs/bank-account.model';
import {
  IAccountMovement,
  IAccountMovementShort,
  INumeraryTransfer,
  IUserChecks,
} from '../../models/ms-account-movements/account-movement.model';
import { IDetailTransfer } from '../../models/ms-accountmvmnt/accountmvmnt.model';

@Injectable({
  providedIn: 'root',
})
export class AccountMovementService extends HttpService {
  constructor() {
    super();
    this.microservice = AccountmvmntEndpoint.BasePath;
  }

  getAllFiltered(params: _Params) {
    //
    return this.get<IListResponse<IAccountMovement>>(
      'account-movements',
      params
    );
  }

  getAllFilterSelf(self?: AccountMovementService, params?: _Params) {
    return self.get<IListResponse<IAccountMovement>>(
      'account-movements',
      params
    );
  }

  getBeneficiarios() {
    return this.get<IListResponse<{ beneficiario_cheque: string }>>(
      AccountmvmntEndpoint.getBeneficiarios
    );
  }

  getMetodoPago(params: ListParams) {
    return this.post(AccountmvmntEndpoint.MetodoDePago, params);
  }

  getDevolutionsBanks() {
    return this.get<IListResponse<IAccountMovementShort>>(
      AccountmvmntEndpoint.getDevolutionsBanks
    );
  }

  getAllUsersChecks(params: _Params) {
    return this.get<IListResponse<IUserChecks>>('user-checks', params);
  }

  updateUserChecks(id: number, body: any) {
    return this.put('user-checks/' + id, body);
  }

  createUserChecks(body: IUserChecks) {
    return this.post('user-checks', body);
  }

  update(movement: any) {
    return this.put(`account-movements`, movement);
  }

  insert(movement: ICuentaInsert) {
    return this.post('account-movements', movement);
  }

  eliminar(movement: any) {
    return this.delete('account-movements', movement);
  }
  create(movement: any) {
    return this.post('account-movements', movement);
  }

  createB(movement: any) {
    return this.post('dev-detail-transfer', movement);
  }

  createA(movement: any) {
    return this.post('dev-numerary-transfer', movement);
  }
  createAccount(movement: any) {
    return this.post('account-movements/lovDeposits', movement);
  }

  createPostQuery(movement: any) {
    return this.post('account-movements/postQuery', movement);
  }

  getAllAccountMovement(params: ListParams) {
    return this.get<IListResponse<any>>('aplication/accountmvmnt', params);
  }
  getAccountAovements(numberGood: number | string, params: ListParams) {
    return this.get<IListResponse<any>>(
      `aplication/get-account-movements/${numberGood}`,
      params
    );
  }

  getAccountById(numberAccount: number | string) {
    return this.get<IListResponse<any>>(
      `aplication/get-search-deposit/${numberAccount}`
    );
  }
  getAccountAovementsIsNull(params: ListParams) {
    return this.get<IListResponse<any>>(
      'aplication/get-search-deposit-2',
      params
    );
  }

  getAccount2(params: _Params) {
    return this.get<IListResponse<any>>('aplication/getaccount/2', params);
  }

  getAccountBank(params: _Params) {
    return this.get<IListResponse<any>>('bank-account', params);
  }

  getBlkMov(params: any) {
    return this.post<IListResponse<any>>('aplication/get-bkl-mov', params);
  }

  getDataBank(params: _Params) {
    return this.get<IListResponse<any>>(`aplication/get-data-bank${params}`);
  }

  eliminarMovementAccount(movement: ICuentaDelete) {
    return this.delete('account-movements', movement);
  }

  getReturnCheck(id: any) {
    return this.get<IListResponse<any>>(`aplication/get-return-checks/${id}`);
  }

  getReturnSaldo(params: any) {
    return this.post<IListResponse<any>>(
      `aplication/get-facta-db-fichas-depo`,
      params
    );
  }

  getMovementAccountXBankAccount(params: _Params) {
    return this.get<IListResponse<any>>(
      'aplication/movementAccountXBankAccount',
      params
    );
  }

  getByReportDataToTurn(reporte: number) {
    return this.get<IListResponse<INumeraryTransfer>>(
      `${AccountmvmntEndpoint.getNoReport}?filter.reportDevNumber=$eq:${reporte}`
    );
  }

  getByNumberReport(reporte: number) {
    return this.get<IListResponse<IDetailTransfer>>(
      `${AccountmvmntEndpoint.getNumberReport}?filter.numberReportDev=$eq:${reporte}`
    );
  }

  // create(data: IDetailTransfer ) {
  //   return this.post<any>(AccountmvmntEndpoint)
  // }

  getbyDelegationCurrency(delegacion: string | number, currency: string) {
    return this.get<IListResponse<IAccountBank>>(
      `${AccountmvmntEndpoint.getAccount}?filter.delegationNumber=$eq:${delegacion}&filter.cveCurrency=$eq:${currency}`
    );
  }

  getDataFile(request: any) {
    return this.post<any>(AccountmvmntEndpoint.getDataFile, request);
  }

  getAccountMovements(
    params: ListParams
  ): Observable<IListResponse<IAccountMovement>> {
    return this.get<IListResponse<any>>('account-movements', params);
  }

  postMassNumeraryGenerate(body: any) {
    return this.post('aplication/massNumeraryGenerate', body);
  }

  postValidateClosingAccounts(body: any) {
    return this.post('aplication/get-vc-dummy', body);
  }

  getPaymentControl(params?: _Params) {
    return this.get<IListResponse<any>>(
      AccountmvmntEndpoint.PaymentControl,
      params
    );
  }

  getPaymentTypeSat(params?: _Params) {
    return this.get<IListResponse<any>>(
      AccountmvmntEndpoint.PaymentTypeSat,
      params
    );
  }

  MovementAccountXBankAccountExcel(params?: _Params) {
    return this.get<IListResponse<any>>(
      AccountmvmntEndpoint.MovementAccountXBankAccountExcel,
      params
    );
  }
}

//``

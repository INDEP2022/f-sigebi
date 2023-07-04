import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import {
  ICuentaDelete,
  ICuentaInsert,
} from 'src/app/core/models/catalogs/bank-modelo-type-cuentas';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IAccountMovement,
  IUserChecks,
} from '../../models/ms-account-movements/account-movement.model';

@Injectable({
  providedIn: 'root',
})
export class AccountMovementService extends HttpService {
  constructor() {
    super();
    this.microservice = 'accountmvmnt';
  }

  getAllFiltered(params: _Params) {
    //
    return this.get<IListResponse<IAccountMovement>>(
      'account-movements',
      params
    );
  }

  getAllUsersChecks(params: _Params) {
    return this.get<IListResponse<IUserChecks>>('user-checks', params);
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
}

//``

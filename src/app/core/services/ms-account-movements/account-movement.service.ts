import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { ICuentaInsert } from 'src/app/core/models/catalogs/bank-modelo-type-cuentas';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IAccountMovement } from '../../models/ms-account-movements/account-movement.model';

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

  getAllAccountMovement(params: ListParams) {
    return this.get<IListResponse<any>>('aplication/accountmvmnt', params);
  }
  getAccountAovements(params: ListParams) {
    return this.get<IListResponse<any>>(
      'aplication/get-account-movements',
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
}

//``

import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
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

  create(movement: any) {
    return this.post('account-movements', movement);
  }
}

//``

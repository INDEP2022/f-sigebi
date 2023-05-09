import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountMvmntEndpoints } from 'src/app/common/constants/endpoints/ms-accountmvmnt-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IAccountMovements } from '../../models/ms-account-movements/account-movements.model';

@Injectable({
  providedIn: 'root',
})
export class AccountMovements extends HttpService {
  // private readonly endpoint: string =
  //   'http://sigebimsqa.indep.gob.mx/parametercomer/api/v1/bank-accounts';

  constructor() {
    super();
    this.microservice = AccountMvmntEndpoints.BasePath;
  }

  getAll(params?: string): Observable<IListResponse<any>> {
    //TODO: UPDATE URL
    console.log(params);
    //let route = 'http://sigebimsqa.indep.gob.mx/accountmvmnt/api/v1/account-movements'
    return this.get<IListResponse<any>>(
      AccountMvmntEndpoints.AccountMovements,
      params
    );
  }

  getByFilters(filters: any) {
    return this.post<IListResponse<IAccountMovements>>(
      AccountMvmntEndpoints.AccountMovements + `/filter-in`,
      filters
    );
  }

  updateAccountMovements(goodId: number, typeProceeding: string) {
    let route = `${AccountMvmntEndpoints.AccountMovements}/type-proceeding/${typeProceeding}/good/${goodId}`;
    return this.put<IListResponse<IAccountMovements>>(route);
  }

  getAccountMovementsById(id: number, params?: _Params) {
    return this.get<{ data: IAccountMovements }>(
      AccountMvmntEndpoints.AccountMovements + `/${id}`,
      params
    );
  }
}

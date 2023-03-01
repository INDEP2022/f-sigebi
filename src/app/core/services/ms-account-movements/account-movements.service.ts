import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountMvmntEndpoints } from 'src/app/common/constants/endpoints/ms-accountmvmnt-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
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

  getAll(params?: ListParams): Observable<IListResponse<any>> {
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
}

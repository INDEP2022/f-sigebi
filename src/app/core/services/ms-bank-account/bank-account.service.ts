import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { BankAccount } from 'src/app/pages/administrative-processes/numerary/tesofe-movements/list-banks/bank';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IBankAccount } from '../../models/catalogs/bank-account.model';
import { IAccountMovement } from '../../models/ms-account-movements/account-movement.model';

@Injectable({
  providedIn: 'root',
})
export class BankAccountService
  extends HttpService
  implements ICrudMethods<IBankAccount>
{
  private readonly api = 'bank-account';

  private readonly apiBank = 'account-movements/getBankAndAccount';

  private readonly apiAccount = 'account-movements';

  constructor(private repository: Repository<IBankAccount>) {
    super();
    this.microservice = 'accountmvmnt';
  }

  getAll(params: Params) {
    return this.repository.getAllPaginated(
      `${this.microservice}/${this.api}`,
      params
    );
  }

  getCveBank(_params: _Params): Observable<IListResponse<IBankAccount>> {
    return this.get<IListResponse<IBankAccount>>(`${this.api}`, _params);
  }

  getById(accountNumber: Object): Observable<IBankAccount> {
    return this.post<IBankAccount>(`${this.api}/find-by-ids`, accountNumber);
  }

  getAllWithFilters(params?: string): Observable<IListResponse<IBankAccount>> {
    return this.get<IListResponse<IBankAccount>>(this.api, params);
  }

  getAllWithFiltersAccount(
    params?: string
  ): Observable<IListResponse<IAccountMovement>> {
    return this.get<IListResponse<IAccountMovement>>(this.apiAccount, params);
  }

  getBankAndAccount() {
    return this.post<IListResponse<BankAccount>>(this.apiBank, {});
  }

  create(model: IBankAccount): Observable<IBankAccount> {
    return this.repository.create(`${this.microservice}/${this.api}`, model);
  }

  update(id: string | number, model: IBankAccount): Observable<Object> {
    return this.put(this.api, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.repository.remove(`${this.microservice}/${this.api}`, id);
  }

  //***** */
}

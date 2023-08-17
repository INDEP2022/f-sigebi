import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { BankAccount } from 'src/app/pages/administrative-processes/numerary/tesofe-movements/list-banks/bank';
import {
  IListResponse,
  IListResponseMessage,
} from '../../interfaces/list-response.interface';
import {
  IBankAccount,
  IProReconcilesGood,
} from '../../models/catalogs/bank-account.model';
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

  private readonly apiStatusCta = 'aplication/get-facta-db-status-cta';

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

  getAllFilterSelf(self?: BankAccountService, params?: _Params) {
    return self.get<IListResponseMessage<IBankAccount>>(
      `${self.api}?filter.accountType=$eq:CONCENTRADORA`,
      //+ '?filter.accountnumberorigindeposit=$not:$null'
      params
    );
  }

  getCveBank(_params: _Params): Observable<IListResponse<IBankAccount>> {
    return this.get<IListResponse<IBankAccount>>(`${this.api}`, _params);
  }

  getCveBankFilter(params?: string) {
    return this.get(`${this.api}`, params);
  }

  getById(accountNumber: Object): Observable<IBankAccount> {
    return this.post<IBankAccount>(`${this.api}/find-by-ids`, accountNumber);
  }

  getStatusCta(statusCta: Object): Observable<IBankAccount> {
    return this.post<any>(this.apiStatusCta, statusCta);
  }

  getAllWithFilters(params?: _Params): Observable<IListResponse<IBankAccount>> {
    return this.get<IListResponse<IBankAccount>>(this.api, params);
  }

  getAllWithFiltersAccount(
    params?: string
  ): Observable<IListResponse<IAccountMovement>> {
    return this.get<IListResponse<IAccountMovement>>(this.apiAccount, params);
  }

  getTransferAccount(Cta: Object): Observable<any> {
    return this.post<any>(this.apiAccount, Cta);
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

  update1(model: IBankAccount): Observable<Object> {
    return this.put(this.api, model);
  }

  remove(body: any): Observable<Object> {
    return this.repository.remove3(`${this.microservice}/${this.api}`, body);
  }

  getDetail(data: Object) {
    return this.repository.create(
      `${this.microservice}/bank-account/get-details`,
      data
    );
  }

  searchByFilterNumeraryMassive(body: IProReconcilesGood, params?: _Params) {
    return this.post(`aplication/proReconcilesGood`, body, params);
  }

  getListCurrencyCve(body?: { currency: string | null }) {
    return this.post(`account-movements/get-cve-currency`, body);
  }

  updateAccountMovExp(body: { noGoods: any[] }) {
    return this.post(`account-movements/update-account-movements-exp`, body);
  }

  updateAccountMovFec(body: { noGoods: any[]; fecTesofe: Date | string }) {
    return this.post(`account-movements/update-account-movements-fec`, body);
  }

  pupInterestsDetail(body: any) {
    return this.post(`/aplication/pup-interests-detail`, body);
  }

  //***** */
}

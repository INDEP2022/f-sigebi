import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { HttpService } from '../../../common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IDateAccountBalance,
  IFactasStatusCta,
  IRecordAccountStatements,
} from '../../models/catalogs/record-account-statements.model';
@Injectable({
  providedIn: 'root',
})
export class RecordAccountStatementsAccountsService
  extends HttpService
  implements ICrudMethods<IRecordAccountStatements>
{
  private readonly route: string = ENDPOINT_LINKS.BankAccount;
  private readonly route2: string = ENDPOINT_LINKS.AccountMovements;
  private readonly route3: string = ENDPOINT_LINKS.Aplication;
  private readonly route4: string = ENDPOINT_LINKS.UserChecks;

  constructor(
    private recordAccountStatementsServiceRepository: Repository<IRecordAccountStatements>
  ) {
    super();
    this.microservice = 'accountmvmnt';
  }

  getById(
    bankCode: string | number,
    params?: ListParams
  ): Observable<IRecordAccountStatements> {
    const route = `${this.route}?filter.cveBank=$eq:${bankCode}`;
    return this.get(route, params);
  }

  getById2(
    bankCode: string | number,
    account: string | number,
    params?: ListParams
  ): Observable<IRecordAccountStatements> {
    const regexPattern = `.*${account}.*`;
    const route = `${this.route}?filter.cveBank=$eq:${bankCode}&filter.accountNumber=$ilike:${regexPattern}`;
    return this.get(route, params);
  }

  getChecks(params?: ListParams): Observable<IRecordAccountStatements> {
    const route = `${this.route4}`;
    return this.get(route, params);
  }

  getDataAccount(
    accountNumber: string | number,
    params?: ListParams
  ): Observable<IListResponse<IRecordAccountStatements>> {
    const route = `${this.route2}?filter.numberAccount=$eq:${accountNumber}`;
    return this.get(route, params);
  }

  getFactasStatusCta(accountNumber: number): Observable<IFactasStatusCta> {
    const route = `${this.route3}/get-factas-status-cta/${accountNumber}`;
    return this.get(route);
  }

  getAccountBalanceDate(
    model: IDateAccountBalance
  ): Observable<IDateAccountBalance> {
    const route = `${this.route3}/get-facta-db-status-cta`;
    return this.post(route, model);
  }

  create(
    model: IRecordAccountStatements
  ): Observable<IRecordAccountStatements> {
    console.log('Creado', model);
    const route = `${this.route2}`;
    console.log('route', route);
    return this.post(route, model);
  }

  remove(model: any) {
    const route = `${this.route2}`;
    return this.delete(route, model);
  }
}

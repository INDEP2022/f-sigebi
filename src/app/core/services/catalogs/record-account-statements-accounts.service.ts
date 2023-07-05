import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';

import { HttpService } from '../../../common/services/http.service';
import { IRecordAccountStatements } from '../../models/catalogs/record-account-statements.model';
@Injectable({
  providedIn: 'root',
})
export class RecordAccountStatementsAccountsService
  extends HttpService
  implements ICrudMethods<IRecordAccountStatements>
{
  private readonly route: string = ENDPOINT_LINKS.BankAccount;
  private readonly route2: string = ENDPOINT_LINKS.AccountMovements;

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
    // return this.recordAccountStatementsServiceRepository.getById02(route, params); //Usando este repositorio, me encadena para usar el microservicio de 'catalog'
  }

  getDataAccount(
    accountNumber: string | number,
    params?: ListParams
  ): Observable<IRecordAccountStatements> {
    const route = `${this.route2}?filter.numberAccount=$eq:${accountNumber}`;
    return this.get(route, params);
  }
}
//http://sigebimsqa.indep.gob.mx/accountmvmnt/api/v1/bank-account?filter.cveBank=$ilike:SANTAND
//http://sigebimsqa.indep.gob.mx/accountmvmnt/api/v1/account-movements?filter.numberAccount=$ilike:17448178

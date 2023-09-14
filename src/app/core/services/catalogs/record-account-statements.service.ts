import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';

import { HttpService } from '../../../common/services/http.service';
import { IRecordAccountStatements } from '../../models/catalogs/record-account-statements.model';
@Injectable({
  providedIn: 'root',
})
export class RecordAccountStatementsService
  extends HttpService
  implements ICrudMethods<IRecordAccountStatements>
{
  private readonly route: string = ENDPOINT_LINKS.bank;
  constructor(
    private recordAccountStatementsServiceRepository: Repository<IRecordAccountStatements>
  ) {
    super();
    this.microservice = 'catalog';
  }

  getAll(
    params?: ListParams
  ): Observable<IListResponse<IRecordAccountStatements>> {
    return this.recordAccountStatementsServiceRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getAllDinamicName(
    name: string | number,
    params?: ListParams
  ): Observable<IListResponse<IRecordAccountStatements>> {
    const route = `${this.route}?filter.name=$ilike:${name}`;
    return this.recordAccountStatementsServiceRepository.getAllPaginated(
      route,
      params
    );
  }

  getAllDinamicBankCode(
    name: string | number,
    params?: ListParams
  ): Observable<IListResponse<IRecordAccountStatements>> {
    const route = `${this.route}?filter.bankCode=$ilike:${name}`;
    return this.recordAccountStatementsServiceRepository.getAllPaginated(
      route,
      params
    );
  }
}

//http://sigebimsqa.indep.gob.mx/catalog/api/v1/bank
//http://sigebimsqa.indep.gob.mx/catalog/api/v1/bank?filter.bankCode=$eq:TESOFE
//http://sigebimsqa.indep.gob.mx/catalog/api/v1/bank?filter.name=$ilike:HSBC

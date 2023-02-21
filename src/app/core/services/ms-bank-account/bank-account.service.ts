import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IBankAccount } from '../../models/catalogs/bank-account.model';

@Injectable({
  providedIn: 'root',
})
export class BankAccountService
  extends HttpService
  implements ICrudMethods<IBankAccount>
{
  constructor(private repository: Repository<IBankAccount>) {
    super();
  }

  getAll(params: Params) {
    return this.repository.getAllPaginated('accountmvmnt/bank-account', params);
  }
}

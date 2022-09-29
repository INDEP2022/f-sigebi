import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { ICustomer } from '../models/customer.model';
@Injectable({
  providedIn: 'root',
})
export class CustomerService implements ICrudMethods<ICustomer> {
  private readonly route: string = ENDPOINT_LINKS.Customer;
  constructor(private customerRepository: Repository<ICustomer>) {}

  getAll(params?: ListParams): Observable<IListResponse<ICustomer>> {
    return this.customerRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ICustomer> {
    return this.customerRepository.getById(this.route, id);
  }

  create(model: ICustomer): Observable<ICustomer> {
    return this.customerRepository.create(this.route, model);
  }

  update(id: string | number, model: ICustomer): Observable<Object> {
    return this.customerRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.customerRepository.remove(this.route, id);
  }
}

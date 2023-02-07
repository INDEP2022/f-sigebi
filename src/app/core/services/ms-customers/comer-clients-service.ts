import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomersEndpoints } from 'src/app/common/constants/endpoints/ms-customers-endpoints';
import { CustomersRepository } from 'src/app/common/repository/repositories/ms-customers-repository';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IComerClients } from '../../models/ms-customers/customers-model';
@Injectable({
  providedIn: 'root',
})
/**
 * @deprecated actualizado a la nueva implementacion de servicios
 */
export class ComerClientsService1 {
  private readonly route: string = CustomersEndpoints.ComerClients;
  constructor(
    private customersRepository: CustomersRepository<IComerClients>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IComerClients>> {
    return this.customersRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IComerClients> {
    return this.customersRepository.getById(this.route, id);
  }

  create(model: IComerClients): Observable<IComerClients> {
    return this.customersRepository.create(this.route, model);
  }

  update(id: string | number, model: IComerClients): Observable<Object> {
    return this.customersRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.customersRepository.remove(this.route, id);
  }
}

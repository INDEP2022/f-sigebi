import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomersEndpoint } from 'src/app/common/constants/endpoints/ms-customers';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ICustomer } from '../../models/catalogs/customer.model';
import { IRepresentative } from '../../models/catalogs/representative-model';
@Injectable({
  providedIn: 'root',
})
export class CustomerService extends HttpService {
  private readonly route: string = ENDPOINT_LINKS.Customer;
  private readonly endpointClients: string = 'comer-clients';
  private readonly clientsBlackList: string =
    'comer-clients?filter.blackList=$eq:S';
  private readonly clientsWhiteList: string =
    'comer-clients?filter.blackList=$eq:N';
  private readonly endpointRepresentative: string =
    'comer-clients-representative';
  constructor(private customerRepository: Repository<ICustomer>) {
    super();
    this.microservice = CustomersEndpoint.Customer;
  }

  getAll(params?: string): Observable<IListResponse<ICustomer>> {
    return this.get<IListResponse<ICustomer>>(this.endpointClients, params);
  }

  getAllClients(params?: string): Observable<IListResponse<IRepresentative>> {
    return this.get<IListResponse<any>>(this.endpointClients, params);
  }

  getAllAgendId(): Observable<IListResponse<ICustomer>> {
    return this.get<IListResponse<ICustomer>>(this.endpointClients);
  }

  getAllClientsBlackList(
    params?: ListParams
  ): Observable<IListResponse<IRepresentative>> {
    return this.get<IListResponse<any>>(this.clientsBlackList, params);
  }

  getAllClientsWhiteList(
    params?: ListParams
  ): Observable<IListResponse<IRepresentative>> {
    return this.get<IListResponse<any>>(this.clientsWhiteList, params);
  }

  getAllRepresentative(
    params?: ListParams
  ): Observable<IListResponse<IRepresentative>> {
    return this.get<IListResponse<IRepresentative>>(
      this.endpointRepresentative,
      params
    );
  }

  getById(id: string | number): Observable<ICustomer> {
    return this.customerRepository.getById(this.route, id);
  }

  create(model: ICustomer): Observable<ICustomer> {
    const route = `${this.endpointClients}`;
    return this.post(route, model);
  }

  updateCustomers(id: string | number, model: ICustomer) {
    const route = `${this.endpointClients}/${id}`;
    return this.put(route, model);
  }

  updateRepresentatives(id: string | number, representative: IRepresentative) {
    const route = `${this.endpointRepresentative}/${id}`;
    return this.put(route, representative);
  }

  remove(id: string | number): Observable<Object> {
    return this.customerRepository.remove(this.route, id);
  }

  getRepresentativeByClients(
    id: string | number,
    params?: ListParams
  ): Observable<IRepresentative> {
    const route = `${this.endpointRepresentative}/${id}`;
    return this.get(route, params);
  }

  getCustomerById(id: string | number): Observable<ICustomer> {
    const route = `${this.endpointClients}/${id}`;
    return this.get(route);
  }
}

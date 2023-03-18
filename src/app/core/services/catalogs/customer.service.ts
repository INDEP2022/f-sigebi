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
    'comer-clients?filter.blackList=S';
  private readonly clientsWhiteList: string =
    'comer-clients?filter.blackList=N';
  private readonly endpointRepresentative: string =
    'comer-clients-representative';
  constructor(private customerRepository: Repository<ICustomer>) {
    super();
    this.microservice = CustomersEndpoint.Customer;
  }

  getAll(params?: string): Observable<IListResponse<ICustomer>> {
    return this.get<IListResponse<ICustomer>>(this.endpointClients, params);
  }

  getAllClients(params?: string): Observable<IListResponse<ICustomer>> {
    return this.get<IListResponse<ICustomer>>(this.endpointClients, params);
  }

  getAllClientsBlackList(
    params?: ListParams
  ): Observable<IListResponse<ICustomer>> {
    return this.get<IListResponse<ICustomer>>(this.clientsBlackList, params);
  }

  getAllClientsWhiteList(
    params?: ListParams
  ): Observable<IListResponse<ICustomer>> {
    return this.get<IListResponse<ICustomer>>(this.clientsWhiteList, params);
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
    // return this.customerRepository.create(this.route, model);
  }

  updateCustomers(id: string | number, customer: ICustomer) {
    const route = `${this.endpointClients}/${id}`;
    return this.put(route, customer);
  }

  updateRepresentatives(id: string | number, representative: IRepresentative) {
    const route = `${this.endpointRepresentative}/${id}`;
    return this.put(route, representative);
  }

  remove(id: string | number): Observable<Object> {
    return this.customerRepository.remove(this.route, id);
  }

  getRepresentativeByClients(id: string | number, params?: ListParams) {
    const route = `${this.endpointRepresentative}/${id}`;
    return this.get(route, params);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientPenaltyEndpoints } from 'src/app/common/constants/endpoints/ms-client-penalty';
import { HttpService } from 'src/app/common/services/http.service';
import {
  ICustomersPenalties,
  IHistoryCustomersPenalties,
} from 'src/app/core/models/catalogs/customer.model';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientPenaltyService extends HttpService {
  private readonly route: string = ClientPenaltyEndpoints.ComerPenalty;
  private readonly route2: string = ClientPenaltyEndpoints.ComerPenaltyHis;
  constructor(
    private clientPenaltyRepository: Repository<ICustomersPenalties>
  ) {
    super();
    this.microservice = ClientPenaltyEndpoints.Penalty;
  }

  getAll(params?: string): Observable<IListResponse<ICustomersPenalties>> {
    return this.get<IListResponse<any>>(this.route, params);
  }

  getAllState(): Observable<IListResponse<ICustomersPenalties>> {
    return this.get<IListResponse<any>>(this.route);
  }

  getById(id: string | number): Observable<ICustomersPenalties> {
    return this.clientPenaltyRepository.getById(this.route, id);
  }

  getByIdComerPenaltyHis(
    id: string | number,
    params?: string
  ): Observable<IListResponse<IHistoryCustomersPenalties>> {
    const route = `${this.route2}?filter.customerId=$eq:${id}`;
    return this.get(route, params);
  }

  create(model: ICustomersPenalties): Observable<ICustomersPenalties> {
    return this.clientPenaltyRepository.create(this.route, model);
  }

  updateCustomers(id: string | number, customersPenaltie: ICustomersPenalties) {
    const route = `${this.route}/${id}`;
    return this.put(route, customersPenaltie);
  }

  remove(id: string | number): Observable<Object> {
    return this.clientPenaltyRepository.remove(this.route, id);
  }
}

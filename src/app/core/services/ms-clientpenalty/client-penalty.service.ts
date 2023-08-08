import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientPenaltyEndpoints } from 'src/app/common/constants/endpoints/ms-client-penalty';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import {
  ICustomerPenaltiesModal,
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
  private readonly route3: string = `comer-penalty?filter.clientId=$eq`;
  constructor(
    private clientPenaltyRepository: Repository<ICustomersPenalties>
  ) {
    super();
    this.microservice = ClientPenaltyEndpoints.Penalty;
  }

  getAll(params?: string) {
    return this.get<IListResponse<any>>(`${this.route}`, params);
  }

  getAllV2(params?: string) {
    return this.get<IListResponse<any>>(
      ClientPenaltyEndpoints.ComerPenaltyV2,
      params
    );
  }

  getAllHist(params?: ListParams) {
    return this.get<IListResponse<any>>(`${this.route2}`, params);
  }

  getAll2() {
    return this.get<any>(`${this.route}/export`);
  }

  getAllState(): Observable<IListResponse<ICustomersPenalties>> {
    return this.get<IListResponse<any>>(this.route);
  }

  getById(id: string | number): Observable<ICustomersPenalties> {
    return this.clientPenaltyRepository.getById(this.route, id);
  }

  getByIdComerPenaltyHis(
    id?: string | number,
    params?: string
  ): Observable<IListResponse<IHistoryCustomersPenalties>> {
    const route = `${this.route2}?filter.customerId=$eq:${id}`;
    return this.get(route, params);
  }

  //http://sigebimstest.indep.gob.mx/penalty/api/v1/comer-penalty-his/export?filter.customerId=$eq:18104
  getByIdComerPenaltyHis2(id: string | number) {
    console.log(id);
    return this.get(`comer-penalty-his/export?filter.customerId=$eq:${id}`);
  }

  getByIdComerPenaltyHis3(id?: string | number) {
    console.log(id);
    return this.get(`comer-penalty-his/export`);
  }

  create(model: ICustomersPenalties): Observable<ICustomersPenalties> {
    return this.post(ClientPenaltyEndpoints.CreatePenalty, model);
    /*return this.clientPenaltyRepository.create(
      ClientPenaltyEndpoints.CreatePenalty,
      model
    );*/
  }

  //ACTUALIZAR
  updateCustomers(customersPenalties: IHistoryCustomersPenalties) {
    console.log(customersPenalties);
    return this.put(`${this.route}/update-penalty`, customersPenalties);
  }

  update(body: any) {
    return this.put(`${this.route}`, body);
  }

  updateCustomers2(customersPenalties: IHistoryCustomersPenalties) {
    console.log(customersPenalties);
    return this.put(`${this.route2}`, customersPenalties);
  }

  updateCustomers1(customersPenalties: ICustomerPenaltiesModal) {
    console.log(customersPenalties);
    return this.put(`${this.route}/update-penalty`, customersPenalties);
  }

  remove(id: string | number): Observable<Object> {
    return this.clientPenaltyRepository.remove(this.route, id);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IContract } from '../../models/administrative-processes/contract.model';

@Injectable({
  providedIn: 'root',
})
export class ContractService
  extends HttpService
  implements ICrudMethods<IContract>
{
  route: string = ENDPOINT_LINKS.StrategyContract;

  constructor(private contractRepository: Repository<IContract>) {
    super();
    this.microservice = 'contract';
  }

  getAll(params?: ListParams): Observable<IListResponse<IContract>> {
    return this.contractRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IContract> {
    let partials = this.route.split('/');
    const route = `${partials[1]}/id/${id}`;
    return this.get(route);
  }

  create(model: IContract): Observable<IContract> {
    return this.contractRepository.create(this.route, model);
  }

  update(id: string | number, model: IContract): Observable<Object> {
    return this.contractRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.contractRepository.remove(this.route, id);
  }
}

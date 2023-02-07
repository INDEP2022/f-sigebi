import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ParameterComerEndpoints } from '../../../common/constants/endpoints/ms-parametercomer-endpoints';

@Injectable({
  providedIn: 'root',
})
export class BankMovementType extends HttpService {
  // private readonly endpoint: string =
  //   'http://sigebimsqa.indep.gob.mx/parametercomer/api/v1/bank-accounts';

  constructor() {
    super();
    this.microservice = ParameterComerEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(
      ParameterComerEndpoints.BankMovements,
      params
    );
  }

  getAllWithFilters(params?: string): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(
      ParameterComerEndpoints.BankMovements,
      params
    );
  }

  create(client: any) {
    return this.post(ParameterComerEndpoints.BankMovements, client);
  }

  update(id: string | number, client: any) {
    const route = `${ParameterComerEndpoints.BankMovements}/${id}`;
    return this.put(route, client);
  }

  remove(id: string | number) {
    const route = `${ParameterComerEndpoints.BankMovements}/${id}`;
    return this.delete(route);
  }
}

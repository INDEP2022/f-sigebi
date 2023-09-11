import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpentEndpoints } from 'src/app/common/constants/endpoints/ms-spent';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import {
  IComerDetExpense,
  IMandContaDTO,
} from '../../models/ms-spent/comer-detexpense';

@Injectable({
  providedIn: 'root',
})
export class ComerDetexpensesService extends HttpService {
  private readonly route = SpentEndpoints;
  constructor() {
    super();
    this.microservice = this.route.BasePath;
  }

  getAll(params?: _Params): Observable<IListResponseMessage<IComerDetExpense>> {
    return this.get<IListResponseMessage<IComerDetExpense>>(
      SpentEndpoints.ExpenseComerDet,
      params
    );
  }

  remove(id: string) {
    return this.delete(SpentEndpoints.ExpenseComerDet + '/' + id);
  }

  create(body: IComerDetExpense) {
    return this.post(SpentEndpoints.ExpenseComerDet, body);
  }

  mandConta(body: IMandContaDTO) {
    return this.post('aplication/get-mandaContaT', body);
  }

  mandContaTpBien(body: IMandContaDTO) {
    return this.post('aplication/get-mandaContaTpBien', body);
  }
}

import { Injectable } from '@angular/core';
import { ParameterComerEndpoints } from 'src/app/common/constants/endpoints/ms-parametercomer-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IParameterComerDTO } from '../models/parametercomer';

@Injectable({
  providedIn: 'root',
})
export class ExpenseParametercomerService extends HttpService {
  constructor() {
    super();
    this.microservice = ParameterComerEndpoints.BasePath;
  }

  getValidGoods(body: IParameterComerDTO) {
    return this.post('aplication/get-bienes-validados', body);
  }
}

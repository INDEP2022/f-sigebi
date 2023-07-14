import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IParameterMod } from '../../models/ms-comer-concepts/parameter-mod.model';

@Injectable({
  providedIn: 'root',
})
export class ParametersModService extends HttpService {
  private readonly endpoint: string = 'parameters-mod';
  constructor() {
    super();
    this.microservice = 'comerconcepts';
  }

  getAllFilter(params?: _Params) {
    return this.get<IListResponse<IParameterMod>>(
      this.endpoint + '/get-all',
      params
    );
  }

  getByParameter(parameter: string) {
    return this.get(`${this.endpoint}/parameter/${parameter}`);
  }
}

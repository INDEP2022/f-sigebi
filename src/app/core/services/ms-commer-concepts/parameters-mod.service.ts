import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import {
  IListResponse,
  IListResponseMessage,
} from '../../interfaces/list-response.interface';
import { IParameterMod } from '../../models/ms-comer-concepts/parameter-mod.model';

@Injectable({
  providedIn: 'root',
})
export class ParametersModService extends HttpService {
  private readonly endpoint: string = 'parameters-mod/get-all';
  constructor() {
    super();
    this.microservice = 'comerconcepts';
  }

  getAll(params?: _Params) {
    return this.get<IListResponseMessage<IParameterMod>>(this.endpoint, params);
  }

  private getAddress(address: string) {
    switch (address) {
      case 'M':
        return 'MUEBLES';
      case 'I':
        return 'INMUEBLES';
      case 'C':
        return 'GENERAL';
      case 'V':
        return 'VIGILANCIA';
      case 'S':
        return 'SEGUROS';
      case 'J':
        return 'JURIDICO';
      case 'A':
        return 'ADMINISTRACIÓN';
      default:
        return null;
    }
  }

  getAllFilter(params?: _Params) {
    return this.get<IListResponse<IParameterMod>>(this.endpoint, params);
  }

  getByParameter(parameter: string) {
    return this.get(`parameters-mod/parameter/${parameter}`);
  }
}

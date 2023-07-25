import { Injectable } from '@angular/core';
import { map } from 'rxjs';
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
  private readonly endpoint: string = 'parameters-mod';
  constructor() {
    super();
    this.microservice = 'comerconcepts';
  }

  getAll(params?: _Params) {
    return this.get<IListResponseMessage<IParameterMod>>(
      this.endpoint + '/get-all',
      params
    ).pipe(
      map(response => {
        return {
          ...response,
          data: response.data.map(x => {
            return {
              ...x,
              address: this.getAddress(x.address),
            };
          }),
        };
      })
    );
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
    return this.get<IListResponse<IParameterMod>>(
      this.endpoint + '/get-all',
      params
    );
  }

  getByParameter(parameter: string) {
    return this.get(`${this.endpoint}/parameter/${parameter}`);
  }
}

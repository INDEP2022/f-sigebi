import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ComerConceptEndpoints } from 'src/app/common/constants/endpoints/ms-comerconcept';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import {
  IParameterConcept,
  IParameterConceptCreate,
  IParameterConceptUpdate,
} from '../../models/ms-comer-concepts/parameter-concept';

@Injectable({
  providedIn: 'root',
})
export class ParametersConceptsService extends HttpService {
  constructor() {
    super();
    this.microservice = ComerConceptEndpoints.BasePath;
  }

  create(body: IParameterConceptCreate) {
    return this.post(ComerConceptEndpoints.ParametersConceptsCreate, body);
  }

  update(body: IParameterConceptUpdate) {
    return this.put(ComerConceptEndpoints.ParametersConceptsUpdate, body);
  }

  remove(body: IParameterConceptUpdate) {
    return this.delete(ComerConceptEndpoints.ParametersConceptsDelete, body);
  }

  getAll(params?: _Params) {
    return this.get<IListResponseMessage<IParameterConcept>>(
      ComerConceptEndpoints.ParametersConcepts,
      params
    ).pipe(
      map(response => {
        return {
          ...response,
          data: response.data.map(x => {
            return {
              ...x,
              address: this.getAddress(x.address),
              description: x.parameterFk.description,
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
}

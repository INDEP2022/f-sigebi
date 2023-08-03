import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ComerConceptEndpoints } from 'src/app/common/constants/endpoints/ms-comerconcept';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import {
  IConcept,
  IConceptCopy,
} from '../../models/ms-comer-concepts/concepts';

@Injectable({
  providedIn: 'root',
})
export class ConceptsService extends HttpService {
  constructor() {
    super();
    this.microservice = ComerConceptEndpoints.BasePath;
  }

  getAll(params?: _Params) {
    return this.get<IListResponseMessage<IConcept>>(
      ComerConceptEndpoints.Concepts,
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

  edit(body: IConcept) {
    return this.put(ComerConceptEndpoints.ConceptsUpdate, body);
  }

  create(body: IConcept) {
    if (body.id || body.id === '') {
      delete body.id;
    }
    return this.post(ComerConceptEndpoints.ConceptsCreate, body);
  }

  remove(body: IConcept) {
    return this.delete(ComerConceptEndpoints.ConceptsDelete + '/' + body.id);
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
        return 'JURÍDICO';
      case 'A':
        return 'ADMINISTRACIÓN';
      default:
        return null;
    }
  }
  copyParameters(body: { id: string; address: string; concept: string }) {
    return this.post<IListResponseMessage<IConceptCopy>>(
      ComerConceptEndpoints.ConceptsParametersCopy,
      body
    );
  }
}

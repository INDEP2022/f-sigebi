import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { ComerConceptEndpoints } from 'src/app/common/constants/endpoints/ms-comerconcept';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import {
  IConcept,
  IConceptCopy,
} from '../../models/ms-comer-concepts/concepts';

export function getAddress(address: string) {
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

  copyParameters(
    body: { id: string; address: string; concept: string },
    params: Params
  ) {
    return this.post<IListResponseMessage<IConceptCopy>>(
      ComerConceptEndpoints.ConceptsParametersCopy,
      body,
      params
    );
  }
}

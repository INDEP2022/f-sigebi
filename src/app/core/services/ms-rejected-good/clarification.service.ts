import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { IClarification } from '../../models/catalogs/clarification.model';

@Injectable({
  providedIn: 'root',
})
export class Clarification2Srvice extends HttpService {
  constructor() {
    super();
    this.microservice = 'catalog';
  }

  update(id: string | number, model: IClarification) {
    const route = `clarification/id/${id}`;
    return this.put(route, model);
  }

  create(model: IClarification) {
    const route = `clarification`;
    return this.post(route, model);
  }
}

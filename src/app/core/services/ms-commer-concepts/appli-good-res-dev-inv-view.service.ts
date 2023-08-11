import { Injectable } from '@angular/core';
import { ComerConceptEndpoints } from 'src/app/common/constants/endpoints/ms-comerconcept';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class AppliGoodResDevViewService extends HttpService {
  constructor() {
    super();
    this.microservice = 'comerconcepts';
  }

  getAll(json?: Object, page?: number, limit?: number) {
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let route = ComerConceptEndpoints.GoodResDevInvView;
    return this.post(`${route}?page=${page}&limit=${limit}`, json);
  }
}

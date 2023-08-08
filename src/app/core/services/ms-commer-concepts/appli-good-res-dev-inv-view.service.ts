import { Injectable } from '@angular/core';
import { ComerConceptEndpoints } from 'src/app/common/constants/endpoints/ms-comerconcept';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class AppliGoodResDevViewService extends HttpService {
  constructor() {
    super();
    this.microservice = 'comerconcepts';
  }

  getAll(params?: ListParams | string) {
    let route = ComerConceptEndpoints.GoodResDevInvView;
    return this.get(`${route}`, params);
  }
}

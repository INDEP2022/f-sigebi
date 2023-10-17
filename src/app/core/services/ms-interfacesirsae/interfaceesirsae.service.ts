import { Injectable } from '@angular/core';
import { InterfaceSirsaeEndpoints } from 'src/app/common/constants/endpoints/ms-interfacesirsae';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class InterfaceesirsaeService extends HttpService {
  private readonly route = InterfaceSirsaeEndpoints;
  constructor() {
    super();
    this.microservice = this.route.Interfaceesirsae;
  }

  loadPayments(params: ListParams) {
    return this.get(`application/selectReference/11998905403245735568`);
  }
}

import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ReportInvoiceService extends HttpService {
  constructor() {
    super();
    this.microservice = 'reportinvoice';
  }

  getAll(params: _Params) {
    const route = `comer-rectfactimgnews`;
    return this.get(route, params);
  }

  create(data: any) {
    const route = `comer-rectfactimgnews`;
    return this.get(route, data);
  }

  update(data: any) {
    const route = `comer-rectfactimgnews`;
    return this.put(route, data);
  }
  remove(data: any) {
    const route = `comer-rectfactimgnews`;
    return this.delete(route, data);
  }
}

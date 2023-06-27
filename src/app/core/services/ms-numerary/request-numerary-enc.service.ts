import { Injectable } from '@angular/core';
import { NumeraryEndpoints } from 'src/app/common/constants/endpoints/ms-numerary';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IRequesNumeraryEnc } from '../../models/ms-numerary/numerary.model';

@Injectable({
  providedIn: 'root',
})
export class RequestNumeraryEncService extends HttpService {
  private readonly route = NumeraryEndpoints;

  constructor() {
    super();
    this.microservice = this.route.Numerary;
  }

  getAllFilter(params?: ListParams | string) {
    return this.get(this.route.RequestEnc, params);
  }

  create(data: IRequesNumeraryEnc) {
    return this.post(this.route.RequestEnc, data);
  }

  update(data: IRequesNumeraryEnc) {
    return this.put(`${this.route.RequestEnc}/${data.solnumId}`, data);
  }

  remove(id: number) {
    return this.delete(`${this.route.RequestEnc}/${id}`);
  }
}

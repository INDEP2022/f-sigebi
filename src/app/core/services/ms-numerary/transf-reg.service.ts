import { Injectable } from '@angular/core';
import { NumeraryEndpoints } from 'src/app/common/constants/endpoints/ms-numerary';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { TransferReg } from '../../models/ms-numerary/numerary.model';

@Injectable({
  providedIn: 'root',
})
export class TransRegService extends HttpService {
  private readonly route = NumeraryEndpoints;

  constructor() {
    super();
    this.microservice = this.route.Numerary;
  }

  getAllFilter(params?: ListParams | string) {
    return this.get<IListResponse<TransferReg>>(this.route.TransReg, params);
  }

  create(data: TransferReg) {
    return this.post(this.route.TransReg, data);
  }

  update(data: TransferReg) {
    return this.put(this.route.TransReg, data);
  }

  remove(data: TransferReg) {
    return this.delete(this.route.TransReg, data);
  }
}

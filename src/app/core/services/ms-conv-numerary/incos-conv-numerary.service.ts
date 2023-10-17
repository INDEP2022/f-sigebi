import { Injectable } from '@angular/core';
import { IncosConvertionNumeraryEndpoints } from 'src/app/common/constants/endpoints/ms-conv-numerary';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import { IIncosConvNumerary } from '../../models/ms-numerary/incos-conv-numerary';

@Injectable({
  providedIn: 'root',
})
export class IncosConvNumeraryService extends HttpService {
  private readonly route = IncosConvertionNumeraryEndpoints;
  constructor() {
    super();
    this.microservice = this.route.BasePath;
  }

  getAll(params: _Params) {
    return this.get<IListResponseMessage<IIncosConvNumerary>>(
      this.route.GetAll,
      params
    );
  }
}

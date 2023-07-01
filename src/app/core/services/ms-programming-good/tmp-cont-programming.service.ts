import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITmpContProgramming } from '../../models/ms-programming-good/tmp-cont-programming.model';
@Injectable({
  providedIn: 'root',
})
export class TmpContProgrammingService extends HttpService {
  constructor() {
    super();
    this.microservice = 'programminggood';
  }

  computeEntities(params: _Params) {
    return this.get<IListResponse<ITmpContProgramming>>(
      'tmp-cont-programming',
      params
    );
  }
}

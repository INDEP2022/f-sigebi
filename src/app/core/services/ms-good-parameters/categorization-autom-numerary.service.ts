import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ICategorizationAutomNumerary } from '../../models/ms-good-parameter/categorization-autom-numerary.model';

@Injectable({
  providedIn: 'root',
})
export class CategorizationAutomNumeraryService extends HttpService {
  constructor() {
    super();
    this.microservice = 'parametergood';
  }
  getAllFiltered(params: _Params) {
    return this.get<IListResponse<ICategorizationAutomNumerary>>(
      `categorzacion-autom-numerario`,
      params
    );
  }
}

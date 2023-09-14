import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IAlternativeClasification } from '../../models/ms-good/alternative-clasification.model';

@Injectable({ providedIn: 'root' })
export class AlternClasificationService extends HttpService {
  constructor() {
    super();
    this.microservice = 'good';
  }

  getAllFilter(params: _Params) {
    return this.get<IListResponse<IAlternativeClasification>>(
      'altern-classification',
      params
    );
  }
}

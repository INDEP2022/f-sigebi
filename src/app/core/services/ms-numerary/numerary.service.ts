import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NumeraryEndpoints } from 'src/app/common/constants/endpoints/ms-numerary';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { INumerary } from '../../models/ms-numerary/numerary.model';

@Injectable({
  providedIn: 'root',
})
export class NumeraryService extends HttpService implements ICrudMethods<any> {
  private readonly route = NumeraryEndpoints;
  constructor() {
    super();
    this.microservice = this.route.Numerary;
  }

  validateCvs(body: any): Observable<any> {
    return this.get(this.route.ValidateCvs, body);
  }

  getAll(params?: ListParams): Observable<IListResponse<INumerary>> {
    return this.get(NumeraryEndpoints.RateInt, params);
  }

  getAllWithFilter(params?: string): Observable<IListResponse<INumerary>> {
    return this.get(NumeraryEndpoints.RateInt, params);
  }

  create(model: INumerary): Observable<INumerary> {
    return this.post(NumeraryEndpoints.RateInt, model);
  }
}

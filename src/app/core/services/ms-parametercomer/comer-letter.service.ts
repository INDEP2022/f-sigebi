import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComerLetterEndpoints } from 'src/app/common/constants/endpoints/comer-letter-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IComerLetter } from '../../models/ms-parametercomer/comer-letter';

@Injectable({
  providedIn: 'root',
})
export class ComerLetterService extends HttpService {
  private readonly endpoint: string = ComerLetterEndpoints.ComerBase;
  constructor() {
    super();
    this.microservice = ComerLetterEndpoints.ComerBase;
  }

  getAll(params?: ListParams): Observable<IListResponse<IComerLetter>> {
    return this.get<IListResponse<IComerLetter>>(this.endpoint, params);
  }
}

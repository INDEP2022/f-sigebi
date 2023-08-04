import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComerLetterEndpoints } from 'src/app/common/constants/endpoints/comer-letter-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IRespLetter } from '../../models/ms-parametercomer/parameter';

@Injectable({
  providedIn: 'root',
})
export class RespLetterService extends HttpService {
  private readonly endpoint: string = ComerLetterEndpoints.ComerBase;
  private readonly endpint2: string = ComerLetterEndpoints.CartasResp;
  constructor() {
    super();
    this.microservice = ComerLetterEndpoints.ComerBase;
  }

  getAll(params?: ListParams): Observable<IListResponse<IRespLetter>> {
    return this.get<IListResponse<IRespLetter>>(this.endpint2, params);
  }
  getByIdResp(id: string | number): Observable<IRespLetter> {
    return this.get(`${this.endpint2}/${id}`);
  }
}

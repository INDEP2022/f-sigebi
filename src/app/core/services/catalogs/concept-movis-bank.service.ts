import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { IListResponse } from '../../interfaces/list-response.interface';
@Injectable({
  providedIn: 'root',
})
export class ConceptMovisBankService extends HttpService {
  constructor() {
    super();
    this.microservice = 'catalog';
  }

  getByKey(params?: ListParams | string): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>('concept-movis-bank', params);
  }
}

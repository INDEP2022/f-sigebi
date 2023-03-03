import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DictationEndpoints } from 'src/app/common/constants/endpoints/ms-dictation-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDictation } from '../../models/ms-dictation/dictation-model';
@Injectable({
  providedIn: 'root',
})
export class DictationService extends HttpService {
  constructor() {
    super();
    this.microservice = DictationEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IDictation>> {
    return this.get<IListResponse<IDictation>>(
      DictationEndpoints.Dictation,
      params
    );
  }
}

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

  getDictationByGood(id: string | number) {
    const filter = `?page=1&filters[0]={"property":"no_bien","comparison":"EQUAL","value":"3182885"}`;
    const route = `${DictationEndpoints.DictationXGood1}?page=1&filters[0]={"property":"no_bien","comparison":"EQUAL","value":"${id}"}`;
    return this.get(route);
  }
}

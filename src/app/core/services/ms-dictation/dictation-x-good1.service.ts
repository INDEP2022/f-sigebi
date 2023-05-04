import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DictationEndpoints } from 'src/app/common/constants/endpoints/ms-dictation-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDictationXGood1 } from '../../models/ms-dictation/dictation-x-good1.model';

@Injectable({
  providedIn: 'root',
})
export class DictationXGood1Service extends HttpService {
  private readonly route = DictationEndpoints;
  constructor() {
    super();
    this.microservice = DictationEndpoints.BasePath;
  }

  getAll(params?: _Params): Observable<IListResponse<IDictationXGood1>> {
    return this.get<IListResponse<IDictationXGood1>>(
      this.route.DictationXGood1,
      params
    );
  }

  getById(body: {
    ofDictNumber: string | number;
    id?: string | number;
    typeDict?: string;
  }): Observable<IDictationXGood1> {
    return this.post(this.route.FindIdsDictationXGood1, body);
  }

  create(body: IDictationXGood1) {
    return this.post(this.route.DictationXGood1, body);
  }

  update(body: Partial<IDictationXGood1>) {
    return this.put(this.route.DictationXGood1, body);
  }

  remove(body: {
    ofDictNumber: string | number;
    id: string | number;
    typeDict: string;
  }) {
    return this.delete(this.route.DictationXGood1, body);
  }
}

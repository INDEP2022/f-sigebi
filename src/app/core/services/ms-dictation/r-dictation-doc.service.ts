import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DictationEndpoints } from 'src/app/common/constants/endpoints/ms-dictation-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IRDictationDoc } from '../../models/ms-dictation/r-dictation-doc.model';

@Injectable({
  providedIn: 'root',
})
export class DictationXGood1Service extends HttpService {
  private readonly route = DictationEndpoints;
  constructor() {
    super();
    this.microservice = DictationEndpoints.BasePath;
  }

  getAll(params?: _Params): Observable<IListResponse<IRDictationDoc>> {
    return this.get<IListResponse<IRDictationDoc>>(
      this.route.DocumentByDictation,
      params
    );
  }

  create(body: IRDictationDoc) {
    return this.post(this.route.DocumentByDictation, body);
  }

  update(id: number | string, body: IRDictationDoc) {
    return this.put(`${this.route.DocumentByDictation}/${id}`, body);
  }

  remove(body: {
    ofDictNumber: string | number;
    id: string | number;
    typeDict: string;
  }) {
    return this.delete(this.route.DocumentByDictation, body);
  }
}

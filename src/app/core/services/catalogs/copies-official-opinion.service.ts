import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DictationEndpoints } from 'src/app/common/constants/endpoints/ms-dictation-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ICopiesOfficialOpinion } from '../../models/ms-dictation/copies-official-opinion.model';

@Injectable({
  providedIn: 'root',
})
export class CopiesOfficialOpinionService extends HttpService {
  private readonly route = DictationEndpoints;
  constructor() {
    super();
    this.microservice = DictationEndpoints.BasePath;
  }

  getAll(params?: _Params): Observable<IListResponse<ICopiesOfficialOpinion>> {
    return this.get<IListResponse<ICopiesOfficialOpinion>>(
      this.route.CopiesOfficialOpinion,
      params
    );
  }

  create(body: ICopiesOfficialOpinion) {
    return this.post(this.route.CopiesOfficialOpinion, body);
  }

  update(body: Partial<ICopiesOfficialOpinion>) {
    return this.put(this.route.CopiesOfficialOpinion, body);
  }

  remove(body: {
    ofDictNumber: string | number;
    id: string | number;
    typeDict: string;
  }) {
    return this.delete(this.route.CopiesOfficialOpinion, body);
  }
}

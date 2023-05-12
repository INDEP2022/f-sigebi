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
  constructor() {
    super();
    this.microservice = DictationEndpoints.BasePath;
  }

  getAll(params?: _Params): Observable<IListResponse<ICopiesOfficialOpinion>> {
    return this.get<IListResponse<ICopiesOfficialOpinion>>(
      DictationEndpoints.CopiesOfficialOpinion,
      params
    );
  }
}

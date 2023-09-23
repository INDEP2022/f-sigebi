import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DictationEndpoints } from 'src/app/common/constants/endpoints/ms-dictation-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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

  create(body: ICopiesOfficialOpinion) {
    return this.post(DictationEndpoints.CopiesOfficialOpinion, body);
  }

  update(body: Partial<ICopiesOfficialOpinion>) {
    return this.put(DictationEndpoints.CopiesOfficialOpinion, body);
  }

  deleteCcp(body: Partial<ICopiesOfficialOpinion>) {
    return this.delete(DictationEndpoints.CopiesOfficialOpinion, body);
  }

  ProceedingsDetailDicta(id: string | number, params: ListParams) {
    return this.get<IListResponse<any>>(
      'application/get-detail-acta-ent-recep-ruling/' + id,
      params
    );
  }
}

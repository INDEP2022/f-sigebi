import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DictationEndpoints } from 'src/app/common/constants/endpoints/ms-dictation-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IOfficialDictation } from '../../models/ms-dictation/official-dictation.model';

@Injectable({
  providedIn: 'root',
})
export class OficialDictationService extends HttpService {
  private readonly route = DictationEndpoints;
  constructor() {
    super();
    this.microservice = DictationEndpoints.BasePath;
  }

  getAll(params?: _Params): Observable<IListResponse<IOfficialDictation>> {
    return this.get<IListResponse<IOfficialDictation>>(
      DictationEndpoints.OfficialDictation,
      params
    );
  }

  getById(body: {
    officialNumber: number;
    typeDict: string;
  }): Observable<IOfficialDictation> {
    return this.get(this.route.FindIdsOfficialDictation, body);
  }

  create(body: IOfficialDictation) {
    return this.post(this.route.OfficialDictation, body);
  }

  update(body: Partial<IOfficialDictation>) {
    return this.put(this.route.OfficialDictation, body);
  }

  remove(body: { officialNumber: number; typeDict: string }) {
    return this.delete(this.route.OfficialDictation, body);
  }
}

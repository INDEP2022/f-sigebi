import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MassivephotoEndpoints } from 'src/app/common/constants/endpoints/ms-massivephoto-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITmpGoodfotDebug } from '../../models/ms-massivephoto/tmp-goodfot-debug.model';

@Injectable({
  providedIn: 'root',
})
export class TmpGoodfotDebugService extends HttpService {
  constructor() {
    super();
    this.microservice = MassivephotoEndpoints.BasePath;
  }

  getAll(params?: _Params): Observable<IListResponse<ITmpGoodfotDebug>> {
    return this.get<IListResponse<ITmpGoodfotDebug>>(
      MassivephotoEndpoints.TmpGoodfotDebug,
      params
    );
  }
}

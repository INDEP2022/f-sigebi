import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { GoodEndpoints } from '../../../common/constants/endpoints/ms-good-endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStatusGood } from '../../models/ms-good/status-good';
import { ILabelByClasif } from '../../models/ms-good/tags-by-good.model';

@Injectable({
  providedIn: 'root',
})
export class StatusGoodService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodEndpoints.Good;
  }

  getAll(params?: ListParams): Observable<IListResponse<IStatusGood>> {
    return this.get<IListResponse<IStatusGood>>('status-good', params);
  }

  getAllSelf(
    self: StatusGoodService,
    params?: string
  ): Observable<IListResponse<IStatusGood>> {
    return self.get<IListResponse<IStatusGood>>('status-good', params);
  }

  getLabelsByClasif(clasifNum: string | number) {
    const route = `status-good/getAllTags/${clasifNum}`;
    return this.get<IListResponse<ILabelByClasif>>(route);
  }

  getById(id: string) {
    return this.get<IStatusGood>('status-good/' + id);
  }
}

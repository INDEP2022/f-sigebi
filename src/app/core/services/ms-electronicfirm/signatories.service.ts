import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ElectronicFirmEndpoint } from 'src/app/common/constants/endpoints/ms-electronicfirm-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ISignatories } from '../../models/ms-electronicfirm/signatories-model';
@Injectable({
  providedIn: 'root',
})
export class SignatoriesService extends HttpService {
  constructor() {
    super();
    this.microservice = ElectronicFirmEndpoint.BasePage;
  }

  getAll(params?: ListParams): Observable<IListResponse<ISignatories>> {
    return this.get<IListResponse<ISignatories>>(
      ElectronicFirmEndpoint.Signatories,
      params
    );
  }

  getSignatoriesFilter(
    learnedType: string | number,
    learnedId: string | number,
    params?: string
  ): Observable<IListResponse<ISignatories>> {
    const route = `${ElectronicFirmEndpoint.Signatories}?filter.learnedType=${learnedType}&filter.learnedId=${learnedId}`;
    return this.get(route, params);
  }
}

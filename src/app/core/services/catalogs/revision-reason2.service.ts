import { Injectable } from '@angular/core';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import { IRevisionReason } from '../../models/catalogs/revision-reason.model';

@Injectable({
  providedIn: 'root',
})
export class RevisionReason2Service extends HttpService {
  constructor() {
    super();
    this.microservice = 'catalog';
  }

  getAll(params?: _Params) {
    return this.get<IListResponseMessage<IRevisionReason>>(
      ENDPOINT_LINKS.RevisionReasonAll,
      params
    );
  }

  getAllFilterSelf2(self?: RevisionReason2Service, params?: _Params) {
    return self.get<IListResponseMessage<IRevisionReason>>(
      ENDPOINT_LINKS.RevisionReasonAll2 +
        '?filter.initialStatus=$eq:CAN&filter.goodType=$eq:M',
      params
    );
  }

  getAllFilterSelf3(self?: RevisionReason2Service, params?: _Params) {
    return self.get<IListResponseMessage<IRevisionReason>>(
      ENDPOINT_LINKS.RevisionReasonAll2 +
        '?filter.initialStatus=$eq:CAN&filter.goodType=$eq:I',
      params
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import { ITmpValSocialLoadSocialCabinet } from '../../models/ms-social-cabinet/tmp-val-load-social-cabinet';

@Injectable({
  providedIn: 'root',
})
export class SocialCabinetService extends HttpService {
  constructor() {
    super();
    this.microservice = 'trackergood';
  }

  getAll(params?: _Params) {
    return this.get<IListResponseMessage<ITmpValSocialLoadSocialCabinet>>(
      GoodTrackerEndpoints.ViewTracker,
      params
    );
  }
}

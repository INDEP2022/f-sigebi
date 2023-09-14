import { Injectable } from '@angular/core';
import { SocialCabinetGoodEndpoints } from 'src/app/common/constants/endpoints/ms-social-cabinet-good';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import { ITmpValSocialLoadSocialCabinet } from '../../models/ms-social-cabinet/tmp-val-load-social-cabinet';
import { IValidSocialCabinet } from '../../models/ms-social-cabinet/valid-social-cabinet.dto';

@Injectable({
  providedIn: 'root',
})
export class SocialCabinetService extends HttpService {
  constructor() {
    super();
    this.microservice = SocialCabinetGoodEndpoints.BasePath;
  }

  getAll(params?: _Params) {
    return this.get<IListResponseMessage<ITmpValSocialLoadSocialCabinet>>(
      SocialCabinetGoodEndpoints.TmpValLoadGabSocial,
      params
    );
  }

  paValidSocialCabinet(body: IValidSocialCabinet) {
    return this.post<IListResponseMessage<any>>(
      SocialCabinetGoodEndpoints.PAValidSocialGabinet,
      body
    );
  }
}

import { Injectable } from '@angular/core';
import { ExternalFirmEndpoint } from 'src/app/common/constants/endpoints/externalfirm-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { IExternalFirm } from '../../models/ms-externalfirm/external-firm';
@Injectable({
  providedIn: 'root',
})
export class ExternalFirmService extends HttpService {
  constructor() {
    super();
    this.microservice = ExternalFirmEndpoint.BasePage;
  }

  encrypt(model: IExternalFirm) {
    const route = `${ExternalFirmEndpoint.Signatories}`;
    return this.post(route, model);
  }
}

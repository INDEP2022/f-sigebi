import { Injectable } from '@angular/core';
import { MassivedepositaryEndpoints } from 'src/app/common/constants/endpoints/ms-massivedepositary-endpoints';

import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class MassiveDepositaryService extends HttpService {
  private readonly route = MassivedepositaryEndpoints;
  constructor() {
    super();
    this.microservice = this.route.BasePath;
  }

  pupBurdenDataCSV(body: FormData) {
    return this.post(this.route.DataCSV, body);
  }

  pupPreviewDataCSV(body: FormData) {
    return this.post(this.route.PreViewDataCSV, body);
  }
}

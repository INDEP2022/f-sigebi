import { Injectable } from '@angular/core';
import { MassivedepositaryEndpoints } from 'src/app/common/constants/endpoints/ms-massivedepositary-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IMassiveDepositary } from '../../models/ms-massivedepositary/massivedepositary-model';

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

  pupPreviewDataCSVForDepositary(body: FormData) {
    return this.post(MassivedepositaryEndpoints.PreViewDataCSV, body);
  }

  burdenDataCSV(model?: IMassiveDepositary) {
    return this.post(MassivedepositaryEndpoints.PupBurdenDataCSV, model);
  }

  //Preguntar que parámetros recibe
  PreviewDataCSV(model?: IMassiveDepositary) {
    return this.post(MassivedepositaryEndpoints.PupPreviewDataCSV, model);
  }
}

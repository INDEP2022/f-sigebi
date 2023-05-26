import { Injectable } from '@angular/core';
import { MassivedepositaryEndpoints } from 'src/app/common/constants/endpoints/ms-massivedepositary-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { IMassiveDepositary } from '../../models/ms-massivedepositary/massivedepositary-model';
@Injectable({
  providedIn: 'root',
})
export class MassiveClientService extends HttpService {
  constructor() {
    super();
    this.microservice = MassivedepositaryEndpoints.BasePath;
  }

  burdenDataCSV(model?: IMassiveDepositary) {
    return this.post(MassivedepositaryEndpoints.PupBurdenDataCSV, model);
  }

  //Preguntar que parámetros recibe
  PreviewDataCSV(model?: IMassiveDepositary) {
    return this.post(MassivedepositaryEndpoints.PupPreviewDataCSV, model);
  }
}

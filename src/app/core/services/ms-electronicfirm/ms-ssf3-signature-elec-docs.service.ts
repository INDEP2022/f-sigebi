import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ElectronicFirmEndpoint } from 'src/app/common/constants/endpoints/ms-electronicfirm-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISSF3FirmaEelecDocs } from '../../models/ms-electronicfirm/ssf3-signature-elec-docs-model';

@Injectable({
  providedIn: 'root',
})
export class Ssf3SignatureElecDocsService extends HttpService {
  constructor() {
    super();
    this.microservice = ElectronicFirmEndpoint.BasePage;
  }

  getAllFiltered(
    params: _Params
  ): Observable<IListResponse<ISSF3FirmaEelecDocs>> {
    return this.get<IListResponse<ISSF3FirmaEelecDocs>>(
      ElectronicFirmEndpoint.SSF3FirmaEelecDocs,
      params
    );
  }
}

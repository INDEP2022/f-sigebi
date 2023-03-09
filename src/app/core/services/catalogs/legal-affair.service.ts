import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LegalAffairEndpoints } from 'src/app/common/constants/endpoints/ms-legal-affair-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ILegalAffair } from '../../models/catalogs/legal-affair-model';

@Injectable({
  providedIn: 'root',
})
export class LegalAffairService extends HttpService {
  constructor() {
    super();
    this.microservice = LegalAffairEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<ILegalAffair>> {
    return this.get<IListResponse<ILegalAffair>>(
      LegalAffairEndpoints.LegalAffair,
      params
    );
  }
}

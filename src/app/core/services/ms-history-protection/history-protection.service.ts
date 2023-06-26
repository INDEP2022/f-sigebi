import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';

import { HistoryProtectionEndpoints } from 'src/app/common/constants/endpoints/ms-history-protection-endpoint';

@Injectable({
  providedIn: 'root',
})
export class HistoryProtectionService extends HttpService {
  constructor() {
    super();
    this.microservice = HistoryProtectionEndpoints.Base;
  }

  getGoodFolioUniversal(idGood: number): Observable<any> {
    const route = HistoryProtectionEndpoints.ReturnGoodFolioUniversal;
    return this.get(`${route}/${idGood}`);
  }
}

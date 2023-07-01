import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThirdPartyAdmonEndpoints } from 'src/app/common/constants/endpoints/ms-third-party-admon-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class StatusHistoryService extends HttpService {
  constructor() {
    super();
    this.microservice = ThirdPartyAdmonEndpoints.BasePath;
  }

  getAll1(params?: _Params): Observable<any> {
    return this.get(`${ThirdPartyAdmonEndpoints.StatusHistory}`, params);
  }
  getAllSearch(formatNumber: number): Observable<any> {
    return this.get(
      `${ThirdPartyAdmonEndpoints.StatusHistory}/?filter.formatNumber=${formatNumber}`
    );
  }
}

//http://sigebimsdev.indep.gob.mx/thirdpartyadmon/api/v1/strategy-log
//http://sigebimsdev.indep.gob.mx/thirdpartyadmon/api/v1/strategy-log?filter.formatNumber=1263

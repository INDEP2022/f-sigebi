import { Injectable } from '@angular/core';
import { Commissionsenpoints } from 'src/app/common/constants/endpoints/ms-commissions-endpoints';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class CommissionsProcessService extends HttpService {
  constructor() {
    super();
    this.microservice = Commissionsenpoints.basepath;
  }

  comissionCentralCoordinate(body: any) {
    return this.post(Commissionsenpoints.ComissionCentralCoordinate, body);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralProcEndpoints } from 'src/app/common/constants/endpoints/ms-generalproc-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IIncidentMaintenance } from '../../models/ms-generalproc/incident-maintenance';

@Injectable({
  providedIn: 'root',
})
export class IncidentMaintenanceService extends HttpService {
  constructor() {
    super();
    this.microservice = GeneralProcEndpoints.GeneralProc;
  }

  getAll(params?: _Params): Observable<IListResponse<IIncidentMaintenance>> {
    return this.get<IListResponse<IIncidentMaintenance>>(
      GeneralProcEndpoints.IncidentMaintenance,
      params
    );
  }
}

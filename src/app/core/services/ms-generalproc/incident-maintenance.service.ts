import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralProcEndpoints } from 'src/app/common/constants/endpoints/ms-generalproc-endpoints';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IIncidentMaintenance } from '../../models/ms-generalproc/incident-maintenance.model';

@Injectable({
  providedIn: 'root',
})
export class IncidentMaintenanceService extends HttpService {
  constructor(
    private incidentMaintenanceRepository: Repository<IIncidentMaintenance>
  ) {
    super();
    this.microservice = GeneralProcEndpoints.GeneralProc;
  }

  getAll(params?: _Params): Observable<IListResponse<IIncidentMaintenance>> {
    return this.get<IListResponse<IIncidentMaintenance>>(
      GeneralProcEndpoints.IncidentMaintenance,
      params
    );
  }

  getAllFilterAprovedUser(params: any) {
    return this.get<IListResponse<any>>(`incident-maintenance`, params);
  }

  // CREAR EL SERVICIO DE PUT
  update4(model: IIncidentMaintenance): Observable<Object> {
    return this.incidentMaintenanceRepository.update4(
      this.microservice + '/' + GeneralProcEndpoints.IncidentMaintenance,
      model
    );
  }

  getTmpErrores(params: any) {
    return this.get<IListResponse<any>>(GeneralProcEndpoints.TmpErrors, params);
  }
}

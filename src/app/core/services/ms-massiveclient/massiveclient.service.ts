import { Injectable } from '@angular/core';
import { MassiveClientEndpoints } from 'src/app/common/constants/endpoints/ms-massiveclient-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
@Injectable({
  providedIn: 'root',
})
export class MassiveClientService extends HttpService {
  constructor() {
    super();
    this.microservice = MassiveClientEndpoints.BasePath;
  }

  exportAllClients(params?: ListParams) {
    return this.get(MassiveClientEndpoints.ExportAll, params);
  }

  exportBlackList(params?: ListParams) {
    return this.get(MassiveClientEndpoints.ExportBlackList, params);
  }

  exportwoutProblem(params?: ListParams) {
    return this.get(MassiveClientEndpoints.ExportwoutProblem, params);
  }

  exportAgents(params?: ListParams) {
    return this.get(MassiveClientEndpoints.ExportAgents, params);
  }
}

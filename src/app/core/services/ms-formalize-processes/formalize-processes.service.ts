import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFormalizeProcessEndpoint } from 'src/app/common/constants/endpoints/formalize-processes-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IFormalizeProcesses } from '../../models/formalize-processes/formalize-processes.model';

@Injectable({
  providedIn: 'root',
})
export class FormalizeProcessService extends HttpService {
  private readonly route = IFormalizeProcessEndpoint;
  constructor() {
    super();
    this.microservice = IFormalizeProcessEndpoint.getFormalizeProcess;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IFormalizeProcesses>> {
    return this.get<IListResponse<IFormalizeProcesses>>(
      this.route.FormalizeProcess,
      params
    );
  }

  update(params?: any): Observable<IListResponse<IFormalizeProcesses>> {
    return this.put<IListResponse<any>>(this.route.FormalizeProcess, params);
  }

  create(params?: any): Observable<IListResponse<IFormalizeProcesses>> {
    return this.post<IListResponse<any>>(this.route.FormalizeProcess, params);
  }
}

import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IJob } from '../../models/ms-officemanagement/job.model';
@Injectable({
  providedIn: 'root',
})
export class JobsService extends HttpService {
  constructor() {
    super();
    this.microservice = 'officemanagement';
  }

  getAllFiltered(params: _Params) {
    return this.get<IListResponse<IJob>>('jobs', params);
  }

  getAll(params: _Params) {
    return this.get('comer-jobs', params);
  }

  postByFilters(body: any) {
    return this.post('application/getOfficeAvaluo', body);
  }

  postByFiltersResponse(body: any) {
    return this.post('application/getOfficeSolicitud', body);
  }

  getById(id: number | string) {
    return this.httpClient.get(
      `${environment.API_URL}officemanagement/api/v1/jobs/${id}`
    );
  }

  create(job: any) {
    const route = `${environment.API_URL}officemanagement/api/v1/jobs`;
    return this.httpClient.post(route, job);
  }

  update(id: string | number, job: any) {
    return this.put(`jobs/${id}`, job);
  }

  getBymanagementNumber(params: _Params) {
    return this.httpClient.get(
      `${environment.API_URL}officemanagement/api/v1/m-job-management?filter.managementNumber/${params}`
    );
  }

  getById_(id: number | string) {
    return this.httpClient.get<IListResponse<IJob>>(
      `${environment.API_URL}officemanagement/api/v1/jobs/${id}`
    );
  }
}

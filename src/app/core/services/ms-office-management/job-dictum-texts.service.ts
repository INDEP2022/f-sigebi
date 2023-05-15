import { Injectable } from '@angular/core';
import { JobDictumTextsEndpoints } from 'src/app/common/constants/endpoints/officemanagement/ms-job-dictum-texts-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IJobDictumTexts } from '../../models/ms-officemanagement/job-dictum-texts.model';
@Injectable({
  providedIn: 'root',
})
export class JobDictumTextsService extends HttpService {
  constructor() {
    super();
    this.microservice = JobDictumTextsEndpoints.BasePath;
  }

  getAll(params: _Params) {
    return this.get<IListResponse<IJobDictumTexts>>(
      JobDictumTextsEndpoints.JobDictumTexts,
      params
    );
  }

  update(jobDictumTexts: IJobDictumTexts) {
    return this.put(JobDictumTextsEndpoints.JobDictumTexts, jobDictumTexts);
  }

  create(jobDictumTexts: IJobDictumTexts) {
    return this.post(JobDictumTextsEndpoints.JobDictumTexts, jobDictumTexts);
  }
}

import { Injectable } from '@angular/core';
import { JobDictumTextsEndpoints } from 'src/app/common/constants/endpoints/officemanagement/ms-job-dictum-texts-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { IJobDictumTexts } from '../../models/ms-officemanagement/job-dictum-texts.model';
@Injectable({
  providedIn: 'root',
})
export class JobDictumTextsService extends HttpService {
  constructor() {
    super();
    this.microservice = JobDictumTextsEndpoints.BasePath;
  }

  create(jobDictumTexts: IJobDictumTexts) {
    return this.post(JobDictumTextsEndpoints.JobDictumTexts, jobDictumTexts);
  }
}

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

  getById(obj: any) {
    return this.post<IListResponse<IJobDictumTexts>>(
      JobDictumTextsEndpoints.JobDictumTextsById,
      obj
    );
  }

  update(jobDictumTexts: Partial<IJobDictumTexts>) {
    return this.put(JobDictumTextsEndpoints.JobDictumTexts, jobDictumTexts);
  }

  create(jobDictumTexts: IJobDictumTexts) {
    return this.post(JobDictumTextsEndpoints.JobDictumTexts, jobDictumTexts);
  }

  remove(body: any) {
    return this.delete(JobDictumTextsEndpoints.JobDictumTexts, body);
  }

  pupExtractData(params: any) {
    const route = `${JobDictumTextsEndpoints.pupExtraeData}`;
    return this.post(route, params);
  }

  pupExtractDatas(params: any) {
    const route = `${JobDictumTextsEndpoints.pupExtraeDatas}`;
    return this.post(route, params);
  }

  getData(good: any) {
    const route = `${JobDictumTextsEndpoints.getData}/${good}`;
    return this.get(route);
  }

  getPupObtInfoPort(params: any) {
    const route = `${JobDictumTextsEndpoints.pupObtInfoPort}`;
    return this.post(route, params);
  }

  getCursorGoods(params: any) {
    const route = `${JobDictumTextsEndpoints.cursorGoods}`;
    return this.post(route, params);
  }

  getcursorCopys(gestion: any) {
    const route = `${JobDictumTextsEndpoints.cursorCopys}/${gestion}`;
    return this.get(route);
  }

  getCursorGoods2(NO_GESTION: any) {
    const route = `${JobDictumTextsEndpoints.cursorGoods2}?limit=10&page=1&filter.id=${NO_GESTION}`;
    return this.get(route);
  }

  getDatas(lote: any, event: any) {
    const route = `${JobDictumTextsEndpoints.getDatas}/${lote}/${event}`;
    return this.get(route);
  }
}

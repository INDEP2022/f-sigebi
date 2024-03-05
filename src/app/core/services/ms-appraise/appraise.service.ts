import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppraiseEndpoints } from 'src/app/common/constants/endpoints/ms-appraise.endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IAppraisers,
  IAppraisersXGood,
} from '../../models/catalogs/appraisers.model';
import { IViewComerAvaluo } from '../../models/ms-appraise/appraise-model';

@Injectable({
  providedIn: 'root',
})
export class AppraiseService extends HttpService {
  constructor(private appraiseRepository: Repository<IAppraisers>) {
    super();
    this.microservice = AppraiseEndpoints.BasePath;
  }

  getAppraiseByFilters(
    params?: string
  ): Observable<IListResponse<IViewComerAvaluo>> {
    return this.get<IListResponse<IViewComerAvaluo>>(
      AppraiseEndpoints.EatAppraisalView,
      params
    );
  }

  exportAppraiseExcel(params: _Params) {
    return this.get<any>(AppraiseEndpoints.EatAppraisalViewExcel, params);
  }

  exportAppraiseSum(params: _Params) {
    return this.get<any>(AppraiseEndpoints.EatAppraisalViewSum, params);
  }

  getAll(params?: ListParams | string): Observable<IListResponse<IAppraisers>> {
    return this.appraiseRepository.getAllPaginated(
      'request-x-appraisal',
      params
    );
  }

  getAllAvaluoXGood(
    params?: ListParams | string
  ): Observable<IListResponse<IAppraisersXGood>> {
    return this.get<IListResponse<IAppraisersXGood>>(
      'appraisal-x-good',
      params
    );
  }

  getPerito(params?: string): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>('proficient?limit=5&page=1', params);
  }

  postGetAppraise(body: any, params?: _Params) {
    return this.post(AppraiseEndpoints.PostAppraise, body, params);
  }

  getDelegation(coordination: number) {
    return this.get(`${AppraiseEndpoints.Delegation}/${coordination}`);
  }

  getComerAvaluo(params?: ListParams | string) {
    return this.get(`${AppraiseEndpoints.ComerAvaluo}`, params);
  }

  getComerDetAvaluo(appraisal: number, status: string, params: any) {
    return this.get(
      `${AppraiseEndpoints.ComerDetAvaluo}?filter.idAppraisal=$eq:${appraisal}`, //&filter.good.status=$ilike:${status}
      params
    );
  }

  getComerAvaluoWhere(appraisal: number, address: string, params: any) {
    return this.get(
      `${AppraiseEndpoints.ComerAvaluoWhere}/${appraisal}/${address}`,
      params
    );
  }

  updateEatDetAppraisal(data: any) {
    return this.put(AppraiseEndpoints.ComerDetAvaluo, data);
  }
}

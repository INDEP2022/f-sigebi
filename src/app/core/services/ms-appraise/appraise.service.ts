import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppraiseEndpoints } from 'src/app/common/constants/endpoints/ms-appraise.endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IAppraisers } from '../../models/catalogs/appraisers.model';
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

  getAll(params?: ListParams | string): Observable<IListResponse<IAppraisers>> {
    return this.appraiseRepository.getAllPaginated(
      'request-x-appraisal',
      params
    );
  }

  getPerito(params?: string): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>('proficient?limit=5&page=1', params);
  }
}

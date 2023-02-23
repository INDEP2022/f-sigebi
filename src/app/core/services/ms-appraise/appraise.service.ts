import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IViewComerAvaluo } from '../../models/ms-appraise/appraise-model';
import { AppraiseEndpoints } from 'src/app/common/constants/endpoints/ms-appraise.endpoints';

@Injectable({
  providedIn: 'root',
})

export class AppraiseService extends HttpService {

    constructor(){
        super();
        this.microservice = AppraiseEndpoints.BasePath;
    }

    getAppraiseByFilters(
        params?: string
        ): Observable<IListResponse<IViewComerAvaluo>> {
    return this.get<IListResponse<IViewComerAvaluo>>(AppraiseEndpoints.EatAppraisalView, params);
  }

}
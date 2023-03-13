import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppraiseEndpoints } from 'src/app/common/constants/endpoints/ms-appraise.endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';
import { IAppraisalMonitor } from '../../models/ms-appraise/appraise-model';

@Injectable({
  providedIn: 'root',
})
export class AppraisesService extends HttpService {
  private readonly endpoint: string = AppraiseEndpoints.BasePath;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private http: HttpClient) {
    super();
    this.microservice = AppraiseEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IAppraisalMonitor>> {
    return this.get<IListResponse<IAppraisalMonitor>>(
      `/appraisal-x-good`,
      params
    );
  }

  getAppraise() {
    const url = `${environment.API_URL}appraise/api/v1/appraisal-x-good`;
    return this.http.get(url);
  }
}

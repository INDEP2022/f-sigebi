import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IAppraisersGood } from '../../models/good/good.model';

@Injectable({
  providedIn: 'root',
})
export class AppraisalGoodService extends HttpService {
  microsevice: string = '';
  constructor() {
    super();
  }

  postAppraisalGood(data: IAppraisersGood, params?: string) {
    let partials = ENDPOINT_LINKS.Appraisers.split('/');
    this.microservice = partials[0];
    return this.post<IListResponse<IAppraisersGood>>(
      partials[1],
      data,
      params
    ).pipe(tap(() => (this.microservice = '')));
  }

  getAppraisalGood(
    params?: string
  ): Observable<IListResponse<IAppraisersGood>> {
    let partials = ENDPOINT_LINKS.Appraisers.split('/');
    this.microservice = partials[0];
    return this.get<IListResponse<IAppraisersGood>>(partials[1], params).pipe(
      tap(() => (this.microservice = ''))
    );
  }
}

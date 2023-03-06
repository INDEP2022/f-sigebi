import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IRequestAppraisal } from '../../models/ms-request-appraisal/request-appraisal.model';

@Injectable({
  providedIn: 'root',
})
export class RequestAppraisalService extends HttpService {
  constructor() {
    super();
    this.microservice = 'appraise';
  }

  postRequestAppraisal(data: IRequestAppraisal) {
    const route = 'request-x-appraisal';
    return this.post<IListResponse<IRequestAppraisal>>(route, data);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MassiveCaptureLineEndPoints } from 'src/app/common/constants/endpoints/ms-massivecaptureline-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class MsMassivecapturelineService extends HttpService {
  constructor() {
    super();
    this.microservice = MassiveCaptureLineEndPoints.MassiveCaptureLine;
  }

  getRefPayDepositories(goodNumber: number): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(
      `${MassiveCaptureLineEndPoints.ApplicationExcel1}/${goodNumber}`
    );
  }
}

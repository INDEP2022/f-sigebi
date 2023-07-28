import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CapturelineEndpoints } from 'src/app/common/constants/endpoints/ms-captureline';
import { HttpService } from 'src/app/common/services/http.service';
import {
  ICaptureLinesMain,
  IDetCapturelines,
} from 'src/app/core/models/catalogs/capture-lines-main.model';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CapturelineService extends HttpService {
  private readonly route: string = CapturelineEndpoints.ComerCaptureLines;
  private readonly route2: string = CapturelineEndpoints.ComerDetCaptureLines;
  constructor() {
    super();
    this.microservice = CapturelineEndpoints.BasePath;
  }

  getAll(params?: string): Observable<IListResponse<ICaptureLinesMain>> {
    return this.get<IListResponse<ICaptureLinesMain>>(this.route, params);
  }

  getAll2(params?: string): Observable<IListResponse<ICaptureLinesMain>> {
    return this.get<IListResponse<ICaptureLinesMain>>(
      `${this.route}/get-all-with-processkey`,
      params
    );
  }

  getAllDetCaptureLines(
    captureLinesId: number | string,
    params?: string
  ): Observable<IListResponse<IDetCapturelines>> {
    return this.get<IListResponse<IDetCapturelines>>(
      `${this.route2}?filter.eventId=$eq:${captureLinesId}`,
      params
    );
  }
}

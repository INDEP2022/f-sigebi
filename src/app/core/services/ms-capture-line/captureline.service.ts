import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CapturelineEndpoints } from 'src/app/common/constants/endpoints/ms-captureline';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
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
  private readonly route3: string = CapturelineEndpoints.AdminCaptureLine;
  constructor(private binnacle: Repository<any>) {
    super();
    this.microservice = CapturelineEndpoints.BasePath;
  }

  getAll(params?: string): Observable<IListResponse<ICaptureLinesMain>> {
    return this.get<IListResponse<ICaptureLinesMain>>(this.route, params);
  }
  getAllAdminCaptureLine(params?: ListParams): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(this.route3, params);
  }

  getSettlementReport(idEvent?: number | string, params?: ListParams) {
    const routeSettlement = `${CapturelineEndpoints.GetSettlementReport}?filter.id_evento=$eq:${idEvent}`;
    return this.get<any>(routeSettlement, params);
  }

  getSettlementReportBody(body: any, params?: ListParams) {
    return this.post<any>(CapturelineEndpoints.GetVarReport, body, params);
  }
  getPaConsultLc(body: any, params?: ListParams) {
    return this.post<any>(CapturelineEndpoints.PaConsultLc, body, params);
  }
  getPaUpdateUniqueKey(body: any) {
    return this.post<any>(CapturelineEndpoints.getPaUpdateUniqueKey, body);
  }
  getAllAdminCaptureLine1(params: ListParams): Observable<IListResponse<any>> {
    return this.binnacle.getAllPaginated(this.route3, params);
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

  //http://sigebimstest.indep.gob.mx/captureline/api/v1/comer-detcapturelines/filterExcel?filter.eventId=$eq:3435
  getAllDetCaptureLinesExport(captureLinesId: number | string) {
    return this.get<any>(
      `comer-detcapturelines/filterExcel?filter.eventId=$eq:${captureLinesId}`
    );
  }
  postSpGenIc2(body: any) {
    return this.post<any>(CapturelineEndpoints.SpGenLc2, body);
  }
}

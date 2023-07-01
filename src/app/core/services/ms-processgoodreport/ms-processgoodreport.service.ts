import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProcessGoodReportEndpoint } from 'src/app/common/constants/endpoints/ms-processgoodreport-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ProcessgoodreportService extends HttpService {
  constructor() {
    super();
    this.microservice = ProcessGoodReportEndpoint.BasePage;
  }

  getReportXMLToFirm(_params: ListParams) {
    const params: any = this.getParams(_params);
    // const header = { responseType: 'arraybuffer' };
    return this.httpClient.get(
      `${this.url}${this.microservice}${ProcessGoodReportEndpoint.GetXMLShowReport}`,
      { params }
    );
  }

  protected getParamsBuild(rawParams: _Params) {
    if (rawParams instanceof HttpParams) {
      return rawParams;
    }

    if (typeof rawParams === 'string') {
      return new HttpParams({ fromString: rawParams });
    }

    if (rawParams instanceof ListParams) {
      return new HttpParams({ fromObject: rawParams });
    }

    return new HttpParams({ fromObject: rawParams });
  }
}

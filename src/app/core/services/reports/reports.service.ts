import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { SiabService } from '../jasper-reports/siab.service';
@Injectable({
  providedIn: 'root',
})
export class ReportService extends HttpService {
  constructor(public siabService: SiabService) {
    super();
  }

  uri =
    'http://reports-qa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPRECEPDOCUM.pdf';
  /**
   * @deprecated Checar como se usara esta parte
   */
  getShippingDocumentsReport(officeNum: number | string) {
    return this.httpClient.get(
      `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPOFIVOLANTE.pdf?NO_OFICIO=${officeNum}`,
      {
        responseType: 'arraybuffer',
      }
    );
  }

  getReport(officeNum: number | string) {
    return this.httpClient.get(
      `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPOFIVOLANTE.pdf?NO_OFICIO=${officeNum}`
    );
  }
  getReportDiario(params: any) {
    return this.httpClient.get(
      `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPRECEPDOCUM.pdf?NO_OFICIO=${params}`
    );
  }
  download(uri: string, params: any): Observable<any> {
    const header: Object = {
      responseType: 'arraybuffer',
    };

    return this.httpClient.get(`${uri}?params=${params}`);
  }
  getRecepcion(params: ListParams) {
    return this.siabService.fetchReport('RGEROFPRECEPDOCUM', params);
    // return this.httpClient.get(
    //   `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPRECEPDOCUM.pdf?PN_DELEG=${PN_DELEG}&PN_SUBDEL=${PN_SUBDEL}&PF_MES=${PF_MES}&PF_ANIO=${PF_ANIO}`
    // );
  }

  getGood() {
    return this.httpClient.get(
      `http://sigebimsqa.indep.gob.mx/catalog/api/v1/good-sssubtype/search`
    );
  }
  getBatch(text: string) {
    return this.httpClient.get(
      `http://reportsqa.indep.gob.mx/catalog/api/v1//batch/search=${text}`
    );
  }
  getGoodType() {
    return this.httpClient.get(
      `http://sigebimsqa.indep.gob.mx/catalog/api/v1/good-type`
    );
  }
}

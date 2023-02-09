import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private httpClient: HttpClient) {}

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
}

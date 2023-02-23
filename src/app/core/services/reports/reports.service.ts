import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDelegation } from '../../models/catalogs/delegation.model';
import { ISubdelegation } from '../../models/catalogs/subdelegation.model';
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
  getReportDiario(params: any) {
    return this.httpClient.get(
      `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPRECEPDOCUM.pdf?NO_OFICIO=${params}`
    );
  }
  download(params: any): Observable<any> {
    const header: Object = {
      responseType: 'arraybuffer',
    };

    return this.httpClient.get(
      `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPRECEPDOCUM.pdf?NO_OFICIO=${params}`
    );
  }
  getRecepcion(
    PN_DELEG: IDelegation,
    PN_SUBDEL: ISubdelegation,
    PF_MES: string,
    PF_ANIO: string
  ) {
    return this.httpClient.get(
      `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPRECEPDOCUM.pdf?PN_DELEG=${PN_DELEG}&PN_SUBDEL=${PN_SUBDEL}&PF_MES=${PF_MES}&PF_ANIO=${PF_ANIO}`
    );
  }
}

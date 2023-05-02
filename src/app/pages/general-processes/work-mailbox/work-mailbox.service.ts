import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { environment } from 'src/environments/environment';
import { ListParams } from '../../../common/repository/interfaces/list-params';

@Injectable({
  providedIn: 'root',
})
export class WorkMailboxService {
  constructor(private htpp: HttpClient, private authService: AuthService) {}

  //TODO: MOVE TO SERVICES FOLDER
  getView(params?: ListParams): Observable<any> {
    const url = `${environment.API_URL}proceduremanagement/api/v1/views/management-process`;
    return this.htpp.get(url, { params });
  }

  getStatus() {
    const url = `${environment.API_URL}proceduremanagement/api/v1/management-area`;
    return this.htpp.get(url);
  }

  getViewBienes(_params?: any): Observable<any> {
    const params = this.getParams(_params);
    const url = `${environment.API_URL}trackergood/api/v1/trackergood/apps/goodtrackertmp`;
    return this.htpp.get(url, { params });
  }

  getViewAntecedente(_params?: any): Observable<any> {
    const params = this.getParams(_params);
    const url = `${environment.API_URL}flier/api/v1/views/background-view`;
    return this.htpp.get(url, { params });
  }

  getProcedureManagement(processNumber: number) {
    const url = `${environment.API_URL}proceduremanagement/api/v1/proceduremanagement/${processNumber}`;
    return this.htpp.get(url);
  }

  getSatOfficeType(officeNumber: string) {
    const url = `${environment.API_URL}interfacesat/api/v1/transfersat-v3/dynamicQuery`;
    return this.htpp.post(url, { officeKey: officeNumber });
  }

  getProcedureManagementHistorical(processNumber: number) {
    const url = `${environment.API_URL}proceduremanagement/api/v1/historical-procedure-management?filter.procedureNumber=${processNumber}&sortBy=dateturned:DESC&limit=1`;
    return this.htpp.get(url);
  }

  getNotificationsFilter(wheelNumber: number) {
    const url = `${environment.API_URL}/notification/api/v1/notification?filter.wheelNumber=${wheelNumber}`;
    return this.htpp.get(url);
  }

  private getParams(rawParams: any) {
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

  /*getFile() {
    const httpOptions = {
      'responseType'  : 'arraybuffer' as 'json'
      //'responseType'  : 'blob' as 'json'        //This also worked
    };
    const url= 'http://sigebimsqa.indep.gob.mx/processgoodreport/report/showReport?nombreReporte=Etiqueta_INAI.jasper&idSolicitud=43733'
    return this.htpp.get(url,httpOptions)
  }*/
  /*getViewHistory () {
    const url = `${environment.API_URL}historyindicator/api/v1/views/history-indicator-view`;

    var raw = JSON.stringify({
      "proceedingsNum": 642973,
      "flierNum": 1206369
    });
    let newReq = this.request.clone();
    const headers = new HttpHeaders();
    newReq = this.request.clone({
        headers: this.request.headers.set(
          'body',
          raw
        ),
    });

    /*const httpOptions = {
      method: 'GET',
      headers: new HttpHeaders(),
       "data": JSON.stringify({
        "proceedingsNum": 642973,
        "flierNum": 1206369
      }),
      redirect: 'follow'
    };*/

  /*newReq = this.request.clone({
        headers: headers,
    });*/
  //this.htpp.options({requestOptions}).
  /*return this.htpp.get(url);
  }*/

  //SERVICIO
  /*getFile() {
    const httpOptions = {
      'responseType'  : 'arraybuffer' as 'json'
      //'responseType'  : 'blob' as 'json'        //This also worked
    };
    const url= 'http://sigebimsqa.indep.gob.mx/processgoodreport/report/showReport?nombreReporte=Etiqueta_INAI.jasper&idSolicitud=43733'
    return this.htpp.get(url,httpOptions)
  }*/
}

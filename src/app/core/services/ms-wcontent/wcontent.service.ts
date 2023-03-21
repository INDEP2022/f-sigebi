import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WContentEndpoint } from 'src/app/common/constants/endpoints/ms-wcontent-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpWContentService } from 'src/app/common/services/http-wcontet.service';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDocTypes, IWContent } from '../../models/ms-wcontent/wcontent.model';

@Injectable({
  providedIn: 'root',
})
export class WContentService extends HttpWContentService {
  private Path = environment.API_URL;
  private http = inject(HttpClient);

  constructor() {
    super();
    this.microservice = WContentEndpoint.Base;
  }

  getDocumentByIdSolicitud(idRequest: number | string): Observable<any> {
    const route = WContentEndpoint.FindDocumentsByIdSolicitud;
    return this.get<any>(`${route}?idSolicitud=${idRequest}`);
  }

  addDocumentToContent(
    nombreDoc: string,
    contentType: string,
    docData: any,
    file: any,
    extension: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('nombreDocumento', nombreDoc);
    formData.append('contentType', contentType);
    formData.append('docData', docData);
    formData.append('archivo', file);
    formData.append('extension', extension);
    return this.post<any>(WContentEndpoint.AddDocumentToContent, formData);
  }

  addImagesToContent(
    nombreDoc: string,
    contentType: string,
    docData: any,
    file: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('nombreDocumento', nombreDoc);
    formData.append('contentType', contentType);
    formData.append('docData', docData);
    formData.append('archivo', file);
    return this.post<any>(WContentEndpoint.AddImagesToContent, formData);
  }

  getDocumentTypes(params: ListParams): Observable<IDocTypes> {
    return this.get<IDocTypes>(WContentEndpoint.DocumentTypes);
  }

  getDocumentos(body: IWContent): Observable<IListResponse<IWContent>> {
    return this.post<IListResponse<IWContent>>(
      WContentEndpoint.GetDocSol,
      body
    );
  }

  getImgGood(body: IWContent): Observable<IListResponse<IWContent>> {
    return this.post<IListResponse<IWContent>>(
      WContentEndpoint.GetImgGood,
      body
    );
  }

  obtainFile(docName: string): Observable<any> {
    return this.get<any>(WContentEndpoint.ObtainFile + '/' + docName);
  }

  callReportFile(reportName: string, idRequest: string) {
    const httpOptions = new HttpHeaders({
      //responseType: 'application/pdf',
      //responseType: 'arraybuffer' as 'json',
      responseType: 'blob',
    });
    const url = `http://sigebimsqa.indep.gob.mx/${WContentEndpoint.CallReport}/${WContentEndpoint.ShowReport}?nombreReporte=${reportName}.jasper&idSolicitud=${idRequest}`;
    //const url =
    //  'http://sigebimsqa.indep.gob.mx/processgoodreport/report/showReport?nombreReporte=AclaracionTransferentesVoluntarias.jasper&ID_DOCUMENTO=10';
    return this.http.get(url, { responseType: 'blob' });
  }
}

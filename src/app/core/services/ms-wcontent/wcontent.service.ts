import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WContentEndpoint } from 'src/app/common/constants/endpoints/ms-wcontent-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpWContentService } from 'src/app/common/services/http-wcontet.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDocTypes, IWContent } from '../../models/ms-wcontent/wcontent.model';

@Injectable({
  providedIn: 'root',
})
export class WContentService extends HttpWContentService {
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

    return this.post<any>(WContentEndpoint.AddImagesTocontent, formData);
  }

  getDocumentTypes(params: ListParams): Observable<IListResponse<IDocTypes>> {
    return this.get<IListResponse<IDocTypes>>(WContentEndpoint.DocumentTypes);
  }

  getDocumentos(
    body: Object,
    params?: ListParams
  ): Observable<IListResponse<IWContent>> {
    return params
      ? this.post<IListResponse<IWContent>>(
          WContentEndpoint.GetDocSol,
          body,
          params
        )
      : this.post<IListResponse<IWContent>>(WContentEndpoint.GetDocSol, body);
  }
  findDocumentBySolicitud(idRequest: number) {
    return this.get(
      `${WContentEndpoint.DocByRequest}?idSolicitud=${idRequest}`
    );
  }
  getImgGood(body: IWContent): Observable<IListResponse<IWContent>> {
    return this.post<IListResponse<IWContent>>(
      WContentEndpoint.GetImgGood,
      body
    );
  }

  getObtainFile(docName: string) {
    return this.get(`${WContentEndpoint.ObtainFile}/${docName}`);
  }

  obtainFile(docName: string): Observable<any> {
    return this.get<any>(WContentEndpoint.ObtainFile + '/' + docName);
  }

  downloadCaratulaINAIFile(reportName: string, idRequest: string) {
    //const httpOptions = new HttpHeaders({
    //responseType: 'application/pdf',
    //responseType: 'arraybuffer' as 'json',
    //responseType: 'blob',
    //});
    const url = `http://sigebimsqa.indep.gob.mx/${WContentEndpoint.CallReport}/${WContentEndpoint.ShowReport}?nombreReporte=${reportName}.jasper&idSolicitud=${idRequest}`;

    return this.http.get(url, { responseType: 'blob' });
  }

  downloadTransferRequestFile(
    reportName: string,
    idRequest: string,
    ciudad?: string
  ) {
    const url = `http://sigebimsqa.indep.gob.mx/${WContentEndpoint.CallReport}/${WContentEndpoint.ShowReport}?nombreReporte=${reportName}.jasper&ID_SOLICITUD=${idRequest}&ID_SOLICITUD=${ciudad}`;

    return this.http.get(url, { responseType: 'blob' });
  }
}

import { Injectable } from '@angular/core';
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
  //private http = inject(HttpClient);
  private Path = environment.API_URL;
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
    file: File,
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

  addImages(formData: Object) {
    return this.post(WContentEndpoint.AddImagesTocontent, formData);
  }

  getDocumentTypes(params: ListParams): Observable<IListResponse<IDocTypes>> {
    return this.get<IListResponse<IDocTypes>>(WContentEndpoint.DocumentTypes);
  }

  getDocumentos(body: Object): Observable<IListResponse<IWContent>> {
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
}

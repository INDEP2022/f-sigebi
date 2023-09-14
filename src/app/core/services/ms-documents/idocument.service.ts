import { Injectable } from '@angular/core';
import { IDocumentEndpoints } from 'src/app/common/constants/endpoints/ms-idocument-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDocumentServiceGetFiles } from '../../models/ms-documents/idocument.interface';

@Injectable({
  providedIn: 'root',
})
export class IDocumentService extends HttpService {
  constructor() {
    super();
    this.microservice = IDocumentEndpoints.Base;
  }

  saveFile(body: any) {
    return this.post<IListResponse<any>>(
      IDocumentEndpoints.fileBrowserSaveFile,
      body
    );
  }
  getFiles(body: IDocumentServiceGetFiles) {
    return this.post<IListResponse<any>>(
      IDocumentEndpoints.fileBrowserFiles,
      body
    );
  }
}

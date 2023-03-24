import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class FileBrowserService extends HttpService {
  constructor() {
    super();
    this.microservice = 'ldocument';
  }

  getFileFromFolioAndName(invoiceNumber: string | number, name: string) {
    const body = { invoiceNumber, name };
    return this.post('file-browser/folio', body);
  }

  getFilenamesFromFolio(invoiceNumber: string | number) {
    return this.post<IListResponse<{ name: string }>>('file-browser/folios', {
      invoiceNumber,
    });
  }
}

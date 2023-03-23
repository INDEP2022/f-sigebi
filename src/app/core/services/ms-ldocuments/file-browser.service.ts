import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class FileBrowserService extends HttpService {
  constructor() {
    super();
    this.microservice = 'ldocument';
  }

  getFileFromFolioAndName(folio: string, name: string) {
    const body = {
      invoiceNumber: folio,
      name,
    };
    return this.post('file-browser/folio', body);
  }
}

import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IPgrFile } from '../../models/ms-ldocument/pgr-file.model';
@Injectable({
  providedIn: 'root',
})
export class FileBrowserService extends HttpService {
  private readonly _url = environment.API_URL;
  private readonly _prefix = environment.URL_PREFIX;
  constructor() {
    super();
    this.microservice = 'ldocument';
  }

  getFileFromFolioAndName(invoiceNumber: string | number, name: string) {
    const body = { invoiceNumber, name };
    return this.post<string>('file-browser/folio', body);
  }

  getFilenamesFromFolio(invoiceNumber: string | number) {
    return this.post<IListResponse<{ name: string }>>('file-browser/folios', {
      invoiceNumber,
    });
  }

  uploadFileByFolio(folio: string | number, file: File, fileField = 'file') {
    const filename = file.name;
    const ext = filename.substring(filename.lastIndexOf('.') + 1) ?? '';
    const formData = new FormData();
    formData.append(fileField, file, `FU_${uuidv4()}.${ext}`);
    formData.append('invoiceNumber', `${folio}`);
    const request = new HttpRequest(
      'POST',
      `${this._url}${this.microservice}/${this._prefix}file-browser/saveFolio`,
      formData,
      { reportProgress: true, responseType: 'json' }
    );
    return this.httpClient.request(request).pipe(
      catchError(error => {
        console.log(error);
        return throwError(() => error);
      })
    );
  }

  deleteByFolioAndFilename(invoiceNumber: string | number, name: string) {
    return this.delete('file-browser/deleteFolio', { invoiceNumber, name });
  }

  getPgrFiles(params: _Params) {
    return this.get<IListResponse<IPgrFile>>(
      'file-browser/getAllRecoverFile',
      params
    );
  }

  findPgrFile(params: _Params) {
    return this.get<IPgrFile>('file-browser/getOneRecoverFile', params);
  }

  moveFile(invoiceNumber: string | number, jobNumber: string | number) {
    return this.post('file-browser/moveFile', { invoiceNumber, jobNumber });
  }
}

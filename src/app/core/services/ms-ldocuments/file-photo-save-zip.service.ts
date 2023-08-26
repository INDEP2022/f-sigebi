import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { IDocumentEndpoints } from 'src/app/common/constants/endpoints/ms-idocument-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';

import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class FilePhotoSaveZipService extends HttpService {
  private readonly _url = environment.API_URL;
  private readonly _prefix = environment.URL_PREFIX;
  constructor() {
    super();
    this.microservice = IDocumentEndpoints.Base;
  }

  uploadFile(identificator: number[], file: File, fileField: string = 'file') {
    const filename = file.name;
    const ext = filename.substring(filename.lastIndexOf('.') + 1) ?? '';
    const formData = new FormData();
    formData.append(fileField, file, `FU_${uuidv4()}.${ext}`);
    formData.append('goodNumber', `${identificator}`);
    const user = localStorage.getItem('username').toUpperCase();
    formData.append('userCreation', user);
    formData.append('recordNumber', '305315076');
    formData.append('photoDate', new Date().toISOString());
    formData.append('photoDateHc', new Date().toISOString());
    const request = new HttpRequest(
      'POST',
      `${this._url}${this.microservice}/${this._prefix}${IDocumentEndpoints.savePhotoZIP}`,
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
}

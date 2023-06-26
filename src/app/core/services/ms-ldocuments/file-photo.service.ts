import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, mergeMap, Observable, of, throwError } from 'rxjs';
import { IDocumentEndpoints } from 'src/app/common/constants/endpoints/ms-idocument-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { IListResponseMessage } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class FilePhotoService extends HttpService {
  private readonly _url = environment.API_URL;
  private readonly _prefix = environment.URL_PREFIX;
  constructor() {
    super();
    this.microservice = IDocumentEndpoints.Base;
  }

  getAll(goodNumber: string) {
    return this.post<IListResponseMessage<{ name: string }>>(
      IDocumentEndpoints.filePhotos,
      { goodNumber }
    ).pipe(
      catchError(x => of({ data: [] as { name: string }[] })),
      map(response => {
        if (response && response.data)
          return response.data.map(item => item.name);
        else {
          return [];
        }
      })
    );
  }

  getAllWidthPhotos(goodNumber: string): Observable<string[]> {
    return this.getAll(goodNumber).pipe(
      map(response => {
        if (response && response.length > 0)
          return response.map(item => this.getById(goodNumber, item));
        else {
          return [];
        }
      }),
      mergeMap(x => this.validationForkJoin(x))
    );
  }

  getById(goodNumber: string, name: string) {
    return this.post<string>(IDocumentEndpoints.filePhoto, {
      goodNumber,
      name,
    });
  }

  deletePhoto(goodNumber: string, name: string) {
    return this.delete(IDocumentEndpoints.filePhoto, { goodNumber, name });
  }

  uploadFile(identificator: any, file: File, fileField: string = 'file') {
    const filename = file.name;
    const ext = filename.substring(filename.lastIndexOf('.') + 1) ?? '';
    const formData = new FormData();
    formData.append(fileField, file, `FU_${uuidv4()}.${ext}`);
    formData.append('goodNumber', `${identificator}`);
    formData.append('consecNumber', '2');
    formData.append('recordNumber', '305315076');
    formData.append('photoDate', new Date().toISOString());
    formData.append('photoDateHc', new Date().toISOString());
    const request = new HttpRequest(
      'POST',
      `${this._url}${this.microservice}/${this._prefix}${IDocumentEndpoints.savePhoto}`,
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

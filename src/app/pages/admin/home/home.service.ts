import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private httpClient: HttpClient) {}

  // ! Ruta para probar la carga de archivos, no existe !!
  uploadFiles(file: File) {
    console.log(file);
    const formData = new FormData();
    formData.append('files', file);
    const request = new HttpRequest(
      'POST',
      'http://localhost:3000/api/v1/files',
      formData,
      { reportProgress: true, responseType: 'json' }
    );
    return this.httpClient.request(request);
  }
}

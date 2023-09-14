import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InterceptorSkipHeader } from 'src/app/common/interceptors/http-errors.interceptor';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class GelectronicFirmService extends HttpService {
  constructor() {
    super();
    this.microservice = 'gelectronicfirm/electronicfirm/documentsign';
  }

  firmDocument(id: string | number, nameTypeDoc: string, model: Object) {
    const headers = new HttpHeaders()
      .set(InterceptorSkipHeader, '')
      .set('Content-Type', 'text/xml')
      .set('Accept', 'text/xml');
    const route = `${environment.API_URL}gelectronicfirm/electronicfirm/documentsign?id=${id}&firma=true&tipoDocumento=${nameTypeDoc}`;
    return this.httpClient.post(`${route}`, model, {
      headers,
      responseType: 'text',
    });
  }
}

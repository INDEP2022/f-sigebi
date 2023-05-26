import { Injectable } from '@angular/core';
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
    const route = `${environment.API_URL}gelectronicfirm/electronicfirm/documentsign?id=${id}&firma=true&tipoDocumento=${nameTypeDoc}`;
    return this.httpClient.post(`${route}`, model);
  }
}

import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
@Injectable({
  providedIn: 'root',
})
export class GelectronicFirmService extends HttpService {
  constructor() {
    super();
    this.microservice = 'gelectronicfirm/electronicfirm/documentsign';
  }

  firmDocument(id: string | number, nameTypeDoc: string, model: Object) {
    const route = `http://sigebimsqa.indep.gob.mx/gelectronicfirm/electronicfirm/documentsign?id=${id}&firma=true&tipoDocumento=${nameTypeDoc}`;
    return this.httpClient.post(`${route}`, model);
  }
}

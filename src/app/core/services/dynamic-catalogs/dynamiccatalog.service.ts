import { Injectable } from '@angular/core';
import { DinamicCatalogEndPoints } from 'src/app/common/constants/endpoints/ms-dinamiccatalog-endpoint';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class DynamicCatalogsService extends HttpService {
  constructor() {
    super();
    this.microservice = DinamicCatalogEndPoints.classifygood;
  }

  getOtkeyOtvalue(body: Object) {
    return this.post(DinamicCatalogEndPoints.getOtkeyOtvalue, body);
  }
}

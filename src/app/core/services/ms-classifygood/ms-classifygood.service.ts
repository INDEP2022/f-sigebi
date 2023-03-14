import { Injectable } from '@angular/core';
import { ClassifyGoodEndPoints } from 'src/app/common/constants/endpoints/ms-classifgood-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { ITagXClasif } from '../../models/ms-classifygood/ms-classifygood.interface';

@Injectable({
  providedIn: 'root',
})
export class ClassifyGoodService extends HttpService {
  constructor() {
    super();
    this.microservice = ClassifyGoodEndPoints.classifygood;
  }

  getTagXClassif(body: ITagXClasif) {
    return this.post(ClassifyGoodEndPoints.tagXClassif, body);
  }
}

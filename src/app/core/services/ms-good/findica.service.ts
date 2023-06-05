import { Injectable } from '@angular/core';
import { GoodProcessPoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class FIndicaService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodProcessPoints.basepath;
  }

  pupGenerateWhere(body: Object) {
    return this.post('findica/pupGenerateWhere', body);
  }

  pupUpdate(
    processingArea: string,
    proceedings: string | number,
    actNumber: string | number
  ) {
    return this.post('findica/pupUpdate', {
      processingArea,
      proceedings,
      actNumber,
    });
  }
}

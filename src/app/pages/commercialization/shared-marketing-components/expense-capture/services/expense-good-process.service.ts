import { Injectable } from '@angular/core';
import { GoodProcessPoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseGoodProcessService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodProcessPoints.basepath;
  }

  PROCESA_EVENTO_CHATARRA(
    id_concepto: number,
    pEvento: number,
    pRetenido: number
  ) {
    return this.put('application/put-process-scrap-event', {
      id_concepto,
      pEvento,
      pRetenido,
    });
  }
}
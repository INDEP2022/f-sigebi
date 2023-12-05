import { Injectable } from '@angular/core';
import { PrepareEventEndpoints } from 'src/app/common/constants/endpoints/ms-prepareevent-endpoints';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ExpensePrepareeventService extends HttpService {
  constructor() {
    super();
    this.microservice = PrepareEventEndpoints.PreparaEvent;
  }

  releaseGoods(idLot: number) {
    return this.get('application/releaseGoods/' + idLot);
  }

  historicUpdate(
    user: string,
    hPogram: string,
    pMotive: string,
    idLot: number
  ) {
    return this.post('application/historicUpdate', {
      user,
      hPogram,
      pMotive,
      idLot,
    });
  }
}

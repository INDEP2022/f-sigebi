import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
@Injectable({
  providedIn: 'root',
})
export class ProgrammingGoodsService extends HttpService {
  constructor() {
    super();
    this.microservice = 'programminggood';
  }

  computeEntities(P_NOACTA: number | string, P_AREATRA: string) {
    return this.post('programminggood/apps/compute-entities', {
      P_NOACTA,
      P_AREATRA,
    });
  }
}

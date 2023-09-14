import { Injectable } from '@angular/core';
import { PartializeGoodEndpoints } from 'src/app/common/constants/endpoints/ms-partialize-good-endpoint';
import { GoodDTO } from 'src/app/common/repository/interfaces/ms-partialize-good';
import { ParametergoodRepository } from 'src/app/common/repository/repositories/parametergood-repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IParameters } from './../../models/ms-parametergood/parameters.model';

@Injectable({
  providedIn: 'root',
})
export class PartializeGoodService extends HttpService {
  constructor(
    private parametergoodRepository: ParametergoodRepository<IParameters>
  ) {
    super();
    this.microservice = 'partializegood';
  }

  getAll(params?: string) {
    return this.get('partialized-good', params);
  }

  partializePaGood(pGoodNum: number) {
    return this.get(`aplication/pa-partialization/${pGoodNum}`);
  }

  partializeGood(body: {}) {
    return this.post('aplication/partWell', body);
  }

  insertGood(body: GoodDTO) {
    return this.post(PartializeGoodEndpoints.InsertGood, body);
  }

  pupInsertGood(body: GoodDTO) {
    return this.post<{
      no_bien: number;
      vobservaciones: string;
      vdesc_padre: string;
      observ_padre: string;
    }>(PartializeGoodEndpoints.PupInsertGood, body);
  }
}

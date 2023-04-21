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

  partializeGood(body: {}) {
    return this.post('aplication/partWell', body);
  }

  insertGood(body: GoodDTO) {
    return this.post(PartializeGoodEndpoints.InsertGood, body);
  }

  pupInsertGood(body: GoodDTO) {
    return this.post(PartializeGoodEndpoints.PupInsertGood, body);
  }
}

import { Injectable } from '@angular/core';
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
}

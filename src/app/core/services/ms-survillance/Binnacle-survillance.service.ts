import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SurvillanceEndpoints } from 'src/app/common/constants/endpoints/ms-survillance';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IVigBinnacle } from '../../models/ms-survillance/survillance';

@Injectable({
  providedIn: 'root',
})
export class BinnacleService extends HttpService {
  private readonly route = SurvillanceEndpoints;
  constructor(private binnacle: Repository<IVigBinnacle>) {
    super();
    this.microservice = this.route.Survillance;
  }

  getAll(params: ListParams): Observable<IListResponse<IVigBinnacle>> {
    return this.binnacle.getAllPaginated(this.route.VigBinnacle, params);
  }
}

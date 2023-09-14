import { Injectable } from '@angular/core';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IAppraisers } from '../../models/catalogs/appraisers.model';

@Injectable({
  providedIn: 'root',
})
export class AppraisersHttpService extends HttpService {
  private readonly route: string = ENDPOINT_LINKS.appraiser;
  private readonly route2: string = 'catalog/appraisers/id';
  constructor(private appraisersRepository: Repository<IAppraisers>) {
    super();
    this.microservice = 'catalog';
  }

  getById(id: string | number) {
    return this.get(`appraisers?filter.id=$eq:${id}`);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IAppraisers } from '../../models/catalogs/appraisers.model';

@Injectable({
  providedIn: 'root',
})
export class AppraisersService implements ICrudMethods<IAppraisers> {
  private readonly route: string = ENDPOINT_LINKS.appraiser;
  private readonly route2: string = 'catalog/appraisers/id';
  constructor(private appraisersRepository: Repository<IAppraisers>) {}

  getAll(params?: ListParams): Observable<IListResponse<IAppraisers>> {
    const ro = this.appraisersRepository.getAllPaginated(this.route, params);
    console.log(ro);
    return ro;
  }

  getById(id: string | number): Observable<IAppraisers> {
    return this.appraisersRepository.getById(this.route, id);
  }

  create(model: IAppraisers): Observable<IAppraisers> {
    return this.appraisersRepository.create(this.route, model);
  }

  update(id: string | number, model: IAppraisers): Observable<Object> {
    return this.appraisersRepository.update(this.route2, id, model);
  }
  remove(id: string | number): Observable<Object> {
    return this.appraisersRepository.remove(this.route2, id);
  }
}

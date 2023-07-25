import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDetailIndParameter } from '../../models/catalogs/detail-ind-parameter.model';

@Injectable({
  providedIn: 'root',
})
export class DetailIndParameterService
  implements ICrudMethods<IDetailIndParameter>
{
  private readonly route: string = ENDPOINT_LINKS.DetailIndParameter;
  constructor(
    private detailIndParameterRepository: Repository<IDetailIndParameter>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IDetailIndParameter>> {
    return this.detailIndParameterRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<IDetailIndParameter> {
    return this.detailIndParameterRepository.getById(this.route, id);
  }

  create(model: IDetailIndParameter): Observable<IDetailIndParameter> {
    return this.detailIndParameterRepository.create(this.route, model);
  }

  update3(model: IDetailIndParameter): Observable<Object> {
    return this.detailIndParameterRepository.update4(this.route, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.detailIndParameterRepository.remove(this.route, id);
  }
}

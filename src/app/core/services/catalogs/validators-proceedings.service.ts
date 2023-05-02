import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IValidatorsProceedings } from '../../models/catalogs/validators-proceedings-model';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsProceedingsService
  implements ICrudMethods<IValidatorsProceedings>
{
  private readonly route: string = ENDPOINT_LINKS.parametergoodActa;
  constructor(
    private maximumTimesRepository: Repository<IValidatorsProceedings>
  ) {}

  getAll(
    params?: ListParams
  ): Observable<IListResponse<IValidatorsProceedings>> {
    return this.maximumTimesRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IValidatorsProceedings> {
    return this.maximumTimesRepository.getById(this.route, id);
  }

  create(model: IValidatorsProceedings): Observable<IValidatorsProceedings> {
    return this.maximumTimesRepository.create(this.route, model);
  }

  update4(model: IValidatorsProceedings): Observable<Object> {
    return this.maximumTimesRepository.update4(this.route, model);
  }
  remove(id: string | number): Observable<Object> {
    return this.maximumTimesRepository.remove(this.route, id);
  }
}

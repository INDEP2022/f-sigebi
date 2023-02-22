import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IFraction } from '../../models/catalogs/fraction.model';
@Injectable({
  providedIn: 'root',
})
export class FractionService implements ICrudMethods<IFraction> {
  private readonly route: string = ENDPOINT_LINKS.Fraction;
  constructor(private fractionRepository: Repository<IFraction>) {}

  getAll(params?: ListParams): Observable<IListResponse<IFraction>> {
    return this.fractionRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IFraction> {
    return this.fractionRepository.getById(this.route, id);
  }

  create(model: IFraction): Observable<IFraction> {
    return this.fractionRepository.create(this.route, model);
  }

  update(id: string | number, model: IFraction): Observable<Object> {
    return this.fractionRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.fractionRepository.remove(this.route, id);
  }
}

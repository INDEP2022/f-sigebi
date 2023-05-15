import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CatFractionExtendRepository } from 'src/app/common/repository/repositories/cat-fraction-extend-repository';
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
  private readonly find: string = ENDPOINT_LINKS.SubTypeGood;
  private fractionExtRepository = inject(CatFractionExtendRepository);

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
    return this.fractionRepository.newUpdateId(this.route, id, model);
  }

  newUpdate(model: IFraction): Observable<Object> {
    return this.fractionRepository.newUpdate(this.route, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.fractionRepository.newRemove(this.route, id);
  }

  getByParentId(id: string | number): Observable<any> {
    return this.fractionExtRepository.getByParendId(this.route, id);
  }
  getSubTypeFraction(id: string | number): Observable<any> {
    return this.fractionExtRepository.getByParendId(this.find, id);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IIfaiSerie } from '../../models/catalogs/ifai-serie.model';
@Injectable({
  providedIn: 'root',
})
export class IfaiSerieService implements ICrudMethods<IIfaiSerie> {
  private readonly route: string = ENDPOINT_LINKS.IfaiSerie;
  constructor(private ifaiSerieRepository: Repository<IIfaiSerie>) {}

  getAll(params?: ListParams): Observable<IListResponse<IIfaiSerie>> {
    return this.ifaiSerieRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IIfaiSerie> {
    return this.ifaiSerieRepository.getById(this.route, id);
  }

  create(model: IIfaiSerie): Observable<IIfaiSerie> {
    return this.ifaiSerieRepository.create(this.route, model);
  }

  update(id: string | number, model: IIfaiSerie): Observable<Object> {
    return this.ifaiSerieRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.ifaiSerieRepository.remove(this.route, id);
  }
}

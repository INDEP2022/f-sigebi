import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ILegend } from '../../models/catalogs/legend.model';
@Injectable({
  providedIn: 'root',
})
export class LegendService implements ICrudMethods<ILegend> {
  private readonly route: string = ENDPOINT_LINKS.Legend;
  constructor(private legendRepository: Repository<ILegend>) {}

  getAll(params?: ListParams): Observable<IListResponse<ILegend>> {
    return this.legendRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ILegend> {
    return this.legendRepository.getById(this.route, id);
  }

  create(model: ILegend): Observable<ILegend> {
    return this.legendRepository.create(this.route, model);
  }

  update(id: string | number, model: ILegend): Observable<Object> {
    return this.legendRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.legendRepository.remove(this.route, id);
  }
}

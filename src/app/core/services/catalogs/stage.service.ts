import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStage } from '../../models/catalogs/stage.model';
@Injectable({
  providedIn: 'root',
})
export class StageService implements ICrudMethods<IStage> {
  private readonly route: string = ENDPOINT_LINKS.Stage;
  constructor(private stageRepository: Repository<IStage>) {}

  getAll(params?: ListParams): Observable<IListResponse<IStage>> {
    return this.stageRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IStage> {
    return this.stageRepository.getById(this.route, id);
  }

  create(model: IStage): Observable<IStage> {
    return this.stageRepository.create(this.route, model);
  }

  update(id: string | number, model: IStage): Observable<Object> {
    return this.stageRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.stageRepository.remove(this.route, id);
  }
}

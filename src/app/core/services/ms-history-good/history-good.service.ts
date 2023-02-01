import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MsHistoryGoodRepository } from 'src/app/common/repository/repositories/history-good-repository';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IHistoryGood } from '../../models/administrative-processes/history-good.model';

@Injectable({
  providedIn: 'root',
})
export class HistoryGoodService implements ICrudMethods<IHistoryGood> {
  private readonly route: string = ENDPOINT_LINKS.HistoryGood;

  private readonly historyRepository = inject(MsHistoryGoodRepository);

  constructor(private requestRepository: Repository<IHistoryGood>) {}

  getAll(params?: ListParams): Observable<IListResponse<IHistoryGood>> {
    return this.historyRepository.getAllPaginated(this.route, params);
  }

  create(model: IHistoryGood): Observable<IHistoryGood> {
    return this.requestRepository.create(this.route, model);
  }

  update(id: string | number, model: IHistoryGood): Observable<Object> {
    return this.requestRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.requestRepository.remove(this.route, id);
  }
  getByGoodAndProcess(model: string): Observable<IListResponse<IHistoryGood>> {
    return this.historyRepository.getByGoodAndProcess(this.route, model);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStatusTransfer } from '../../models/catalogs/status-transfer.model';
@Injectable({
  providedIn: 'root',
})
export class StatusTransferService implements ICrudMethods<IStatusTransfer> {
  private readonly route: string = ENDPOINT_LINKS.StatusTransfer;
  constructor(private statusTransferRepository: Repository<IStatusTransfer>) {}

  getAll(params?: ListParams): Observable<IListResponse<IStatusTransfer>> {
    return this.statusTransferRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IStatusTransfer> {
    return this.statusTransferRepository.getById(this.route, id);
  }

  create(model: IStatusTransfer): Observable<IStatusTransfer> {
    return this.statusTransferRepository.create(this.route, model);
  }

  update(id: string | number, model: IStatusTransfer): Observable<Object> {
    return this.statusTransferRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.statusTransferRepository.remove(this.route, id);
  }
}

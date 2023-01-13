import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGood } from '../../models/good/good.model';
@Injectable({
  providedIn: 'root',
})
export class GoodService implements ICrudMethods<IGood> {
  private readonly route: string = 'pendiente/parametros';
  constructor(private goodRepository: Repository<IGood>) {}

  getAll(params?: ListParams): Observable<IListResponse<IGood>> {
    return this.goodRepository.getAllPaginated('good/good', params);
  }

  getById(id: string | number): Observable<IGood> {
    return this.goodRepository.getById('good/good', id);
  }

  getGoodsByRecordId(recordId: number) {
    return this.goodRepository.getAllPaginated(
      'good/good/getidReferenceGood/' + recordId
    );
  }
}

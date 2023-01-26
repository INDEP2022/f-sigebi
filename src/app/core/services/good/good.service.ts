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

  getById(id: string | number): Observable<any> {
    return this.goodRepository.getById('good/good', id);
  }

  getGoodsByRecordId(recordId: number) {
    return this.goodRepository.getAllPaginated(
      'good/good/getidReferenceGood/' + recordId
    );
  }

  getGoodAtributesByClasifNum(clasifNum: number) {
    const route = `good/good/searchAttributeClasifGood/${clasifNum}`;
    const params = { inicio: 1, pageSize: 150 };
    return this.goodRepository.getAllPaginated(route, params);
  }

  updateStatusGood(
    idGood: string | number,
    idStatus: string | number,
    model: IGood
  ): Observable<Object> {
    const route = 'good/good/updateGoodStatus';
    return this.goodRepository.update3(route, idGood, idStatus, model);
  }

  getStatusAll() {
    return this.goodRepository.getAllPaginated('good/status-good');
  }
  getStatusByGood(idGood: string | number): Observable<any> {
    const route = 'good/good/getDescAndStatus';
    return this.goodRepository.getById(route, idGood);
  }
}

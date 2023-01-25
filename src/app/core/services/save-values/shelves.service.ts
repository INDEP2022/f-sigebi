import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShelvesEndpoints } from 'src/app/common/constants/endpoints/shelves-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ShelvesRepository } from 'src/app/common/repository/repositories/shelves-repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IShelves } from '../../models/catalogs/shelves.model';
@Injectable({
  providedIn: 'root',
})
export class ShelvessService {
  private readonly route = ShelvesEndpoints;
  // private readonly route2 : string = ShelvesEndpoints.Post;

  constructor(private shelvesRepository: ShelvesRepository<IShelves>) {}

  getAll(params?: ListParams): Observable<IListResponse<IShelves>> {
    return this.shelvesRepository.getAll(this.route.ShelvesByKey, params);
  }

  getByCveSaveValues(
    id: string | number,
    params?: ListParams
  ): Observable<IListResponse<IShelves>> {
    return this.shelvesRepository.getByCveSaveValues(
      this.route.ShelvesByKey,
      id,
      params
    );
  }

  //  update(model: IShelves): Observable<Object> {
  //     return this.shelvesRepository.update(this.route2, model);
  //   }

  update(id: string | number, formData: IShelves): Observable<Object> {
    return this.shelvesRepository.update(this.route.Put, id, formData);
  }

  /*getGoodsByRecordId(recordId: number) {
    return this.goodRepository.getAllPaginated(
      'good/good/getidReferenceGood/' + recordId
    );
  }*/
}

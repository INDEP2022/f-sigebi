import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShelvesEndpoints } from 'src/app/common/constants/endpoints/shelves-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ShelvesRepository } from 'src/app/common/repository/repositories/shelves-repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IShelves } from '../../models/catalogs/shelves.model';
@Injectable({
  providedIn: 'root',
})
export class ShelvessService extends HttpService {
  private readonly route = ShelvesEndpoints;
  private readonly route2: string = '';
  // private readonly route2 : string = ShelvesEndpoints.Post;

  constructor(private shelvesRepository: ShelvesRepository<IShelves>) {
    super();
    this.microservice = 'catalog';
  }

  getAll(params?: ListParams): Observable<IListResponse<IShelves>> {
    return this.shelvesRepository.getAll(this.route.ShelvesByKey, params);
  }

  getByCveSaveValues(
    id: string | number,
    params?: ListParams
  ): Observable<IListResponse<IShelves>> {
    return this.shelvesRepository.getByCveSaveValues(this.route2, id, params);
  }

  getShelvesByIds(
    key: string,
    numBattery: number | string,
    numShelf: number | string,
    body?: {},
    params?: ListParams
  ): Observable<IListResponse<IShelves>> {
    if (params) {
      params['key'] = key;
    }
    const route = ShelvesEndpoints.Test;
    return this.post<IListResponse<IShelves>>(route, '04');
  }

  getShelvesById(params: ListParams) {
    return this.shelvesRepository.getAllPaginated(this.route.Post, params);
  }

  //  update(model: IShelves): Observable<Object> {
  //     return this.shelvesRepository.update(this.route2, model);
  //   }

  update(id: string | number, formData: IShelves): Observable<Object> {
    return this.shelvesRepository.update(this.route.Put, id, formData);
  }

  create(model: IShelves): Observable<IShelves> {
    return this.shelvesRepository.create(this.route2, model);
  }

  /*getGoodsByRecordId(recordId: number) {
    return this.goodRepository.getAllPaginated(
      'good/good/getidReferenceGood/' + recordId
    );
  }*/
}

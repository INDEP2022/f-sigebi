import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AffairTypeEndpoints } from 'src/app/common/constants/endpoints/affair-type-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AffairTypeRepository } from 'src/app/common/repository/repositories/affair-type-repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IAffairType } from '../../models/catalogs/affair-type-model';
@Injectable({
  providedIn: 'root',
})
export class AffairTypeService extends HttpService {
  private readonly route = AffairTypeEndpoints;

  constructor(private affairTypeRepository: AffairTypeRepository<IAffairType>) {
    super();
    this.microservice = AffairTypeEndpoints.Catalog;
  }

  getAll(params?: ListParams): Observable<IListResponse<IAffairType>> {
    return this.affairTypeRepository.getAll(this.route.Code, params);
  }

  getAffairTypeById(
    code: string | number,
    params?: ListParams
  ): Observable<IListResponse<IAffairType>> {
    return this.affairTypeRepository.getAffairTypeById(
      this.route.Code,
      code,
      params
    );
  }

  create(model: IAffairType): Observable<IAffairType> {
    return this.affairTypeRepository.create(this.route.Create, model);
  }

  update(
    code: string | number,
    referralNoteType: string | number,
    model: IAffairType
  ): Observable<Object> {
    return this.affairTypeRepository.update(code, referralNoteType, model);
  }

  // getByAffair(id: number | string, params?: ListParams): Observable<IListResponse<IAffairType>> {
  //   if (params) {
  //     params['id'] = id;
  //   }
  //   const ms = AffairTypeEndpoints.AffairType
  //   const filter = AffairTypeEndpoints.byAffairId;
  //   return this.get<IListResponse<IAffairType>>(ms, filter);
  // }

  getByAffair(
    id: number | string,
    params?: ListParams
  ): Observable<IListResponse<IAffairType>> {
    if (params) {
      params['id'] = id;
    }
    const route = AffairTypeEndpoints.byAffairId;
    return this.get<IListResponse<IAffairType>>(route, params);
  }
}

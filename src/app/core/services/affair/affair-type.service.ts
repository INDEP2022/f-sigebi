import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AffairTypeEndpoints } from 'src/app/common/constants/endpoints/affair-type-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AffairTypeRepository } from 'src/app/common/repository/repositories/affair-type-repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IAffairType } from '../../models/catalogs/affair-type-model';
@Injectable({
  providedIn: 'root',
})
export class AffairTypeService {
  private readonly route = AffairTypeEndpoints;

  constructor(
    private affairTypeRepository: AffairTypeRepository<IAffairType>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IAffairType>> {
    return this.affairTypeRepository.getAll(this.route.Code, params);
  }

  getByAffairId(
    code: string | number,
    params?: ListParams
  ): Observable<IListResponse<IAffairType>> {
    return this.affairTypeRepository.getByAffairId(
      this.route.Code,
      code,
      params
    );
  }

  update(code: string | number, formData: IAffairType): Observable<Object> {
    return this.affairTypeRepository.update(this.route.Code, code, formData);
  }
  /*getGoodsByRecordId(recordId: number) {
    return this.goodRepository.getAllPaginated(
      'good/good/getidReferenceGood/' + recordId
    );
  }*/
}

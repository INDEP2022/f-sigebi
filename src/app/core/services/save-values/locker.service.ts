import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockerEndpoints } from 'src/app/common/constants/endpoints/locker-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { LockerRepository } from 'src/app/common/repository/repositories/locker-repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ILocker } from '../../models/catalogs/locker.model';
@Injectable({
  providedIn: 'root',
})
export class LockersService {
  private readonly route = LockerEndpoints;

  constructor(private lockerRepository: LockerRepository<ILocker>) {}

  getAll(params?: ListParams): Observable<IListResponse<ILocker>> {
    return this.lockerRepository.getAll(this.route.FilterSaveValueKey, params);
  }

  getByCveSaveValues(
    id: string | number,
    params?: ListParams
  ): Observable<IListResponse<ILocker>> {
    return this.lockerRepository.getByCveSaveValues(
      this.route.FilterSaveValueKey,
      id,
      params
    );
  }

  update(id: string | number, formData: ILocker): Observable<Object> {
    return this.lockerRepository.update(
      this.route.FilterSaveValueKey,
      id,
      formData
    );
  }

  create(model: ILocker): Observable<ILocker> {
    return this.lockerRepository.create(this.route.Post, model);
  }

  /*getGoodsByRecordId(recordId: number) {
    return this.goodRepository.getAllPaginated(
      'good/good/getidReferenceGood/' + recordId
    );
  }*/
}

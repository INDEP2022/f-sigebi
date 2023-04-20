import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockerEndpoints } from 'src/app/common/constants/endpoints/locker-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { LockerRepository } from 'src/app/common/repository/repositories/locker-repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ILocker } from '../../models/catalogs/locker.model';
@Injectable({
  providedIn: 'root',
})
export class LockersService extends HttpService {
  private readonly route = LockerEndpoints;

  constructor(private lockerRepository: LockerRepository<ILocker>) {
    super();
    this.microservice = LockerEndpoints.BasePage;
  }

  getAll(params?: ListParams): Observable<IListResponse<ILocker>> {
    return this.lockerRepository.getAll(this.route.FilterSaveValueKey, params);
  }

  getByCveSaveValues(
    saveValueKey: string | number,
    numBattery: string | number,
    numShelf: string | number,
    params?: ListParams
  ): Observable<IListResponse<ILocker>> {
    return this.lockerRepository.getByCveSaveValues(
      this.route.Locker,
      saveValueKey,
      numBattery,
      numShelf,
      params
    );
  }

  update(formData: ILocker): Observable<Object> {
    return this.lockerRepository.update(formData);
  }

  create(model: ILocker): Observable<ILocker> {
    return this.lockerRepository.create(this.route.Locker, model);
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }

  remove(id: string | number) {
    const route = `${LockerEndpoints.Locker}/id/${id}`;
    return this.delete(route);
  }
}

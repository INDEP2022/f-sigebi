import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BatteryEndpoints } from 'src/app/common/constants/endpoints/battery-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BatteryRepository } from 'src/app/common/repository/repositories/battery-repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IBattery } from '../../models/catalogs/battery.model';
@Injectable({
  providedIn: 'root',
})
export class BatterysService {
  private readonly route = BatteryEndpoints;

  constructor(private batteryRepository: BatteryRepository<IBattery>) {}

  getAll(params?: ListParams): Observable<IListResponse<IBattery>> {
    return this.batteryRepository.getAll(this.route.FilterStoreCode, params);
  }

  getByCveSaveValues(
    id: string | number,
    params?: ListParams
  ): Observable<IListResponse<IBattery>> {
    return this.batteryRepository.getByCveSaveValues(
      this.route.FilterStoreCode,
      id,
      params
    );
  }

  update(id: string | number, formData: IBattery): Observable<Object> {
    return this.batteryRepository.update(
      this.route.FilterStoreCode,
      id,
      formData
    );
  }
  /*getGoodsByRecordId(recordId: number) {
    return this.goodRepository.getAllPaginated(
      'good/good/getidReferenceGood/' + recordId
    );
  }*/
}

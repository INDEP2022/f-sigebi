import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BatteryEndpoints } from 'src/app/common/constants/endpoints/battery-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BatteryRepository } from 'src/app/common/repository/repositories/battery-repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IBattery } from '../../models/catalogs/battery.model';
@Injectable({
  providedIn: 'root',
})
export class BatterysService extends HttpService {
  private readonly route = BatteryEndpoints;
  private readonly route2: string = '';

  constructor(private batteryRepository: BatteryRepository<IBattery>) {
    super();
    this.microservice = BatteryEndpoints.BasePage;
  }

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

  create(model: IBattery): Observable<IBattery> {
    return this.batteryRepository.create(this.route2, model);
  }

  getBatteryById(params: ListParams) {
    return this.batteryRepository.getAllPaginated(this.route.Post, params);
  }

  remove(id: string | number) {
    const route = `${BatteryEndpoints.Battery}/id/${id}`;
    return this.delete(route);
  }

  update2(id: string | number, model: IBattery) {
    const route = `${BatteryEndpoints.Battery}/id/${id}`;
    return this.put(route, model);
  }
}

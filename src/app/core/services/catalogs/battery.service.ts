import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IBattery } from '../../models/catalogs/battery.model';
@Injectable({
  providedIn: 'root',
})
export class BatteryService implements ICrudMethods<IBattery> {
  private readonly route: string = ENDPOINT_LINKS.Battery;
  constructor(private batteryRepository: Repository<IBattery>) {}

  getAll(params?: ListParams): Observable<IListResponse<IBattery>> {
    return this.batteryRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IBattery> {
    return this.batteryRepository.getById(this.route, id);
  }

  create(model: IBattery): Observable<IBattery> {
    return this.batteryRepository.create(this.route, model);
  }

  update(id: string | number, model: IBattery): Observable<Object> {
    return this.batteryRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.batteryRepository.remove(this.route, id);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IHoliday } from '../../models/catalogs/holiday.model';
@Injectable({
  providedIn: 'root',
})
export class HolidayService implements ICrudMethods<IHoliday> {
  private readonly route: string = ENDPOINT_LINKS.Holiday;
  constructor(private holidayRepository: Repository<IHoliday>) {}

  getAll(params?: ListParams): Observable<IListResponse<IHoliday>> {
    return this.holidayRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IHoliday> {
    return this.holidayRepository.getById(this.route, id);
  }

  create(model: IHoliday): Observable<IHoliday> {
    return this.holidayRepository.create(this.route, model);
  }

  update(id: string | number, model: IHoliday): Observable<Object> {
    return this.holidayRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.holidayRepository.remove(this.route, id);
  }
}

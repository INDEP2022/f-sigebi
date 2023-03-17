import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ICalendar } from '../../models/catalogs/calendar-model';

@Injectable({
  providedIn: 'root',
})
export class CalendarService implements ICrudMethods<ICalendar> {
  private readonly route: string = ENDPOINT_LINKS.calendar;
  private readonly route1: string = ENDPOINT_LINKS.calendarId;
  constructor(private calendarRepository: Repository<ICalendar>) {}

  getAll(params?: ListParams): Observable<IListResponse<ICalendar>> {
    return this.calendarRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ICalendar> {
    return this.calendarRepository.getById(this.route, id);
  }

  getById3(id: string | number): Observable<IListResponse<ICalendar>> {
    return this.calendarRepository.getById3(
      `${this.route1}/search-by-year`,
      id
    );
  }

  create(model: ICalendar): Observable<ICalendar> {
    return this.calendarRepository.create(this.route, model);
  }

  update(id: string | number, model: ICalendar): Observable<Object> {
    return this.calendarRepository.update(this.route, id, model);
  }

  remove(model: any): Observable<Object> {
    console.log(model);
    return this.calendarRepository.remove3(this.route, model);
  }
}

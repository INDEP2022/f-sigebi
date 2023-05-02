import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { EventEndpoints } from 'src/app/common/constants/endpoints/ms-event-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IComerSaleStatus } from '../../models/ms-event/sale-status.model';

@Injectable({
  providedIn: 'root',
})
export class ComerSaleStatusService extends HttpService {
  private readonly endpoint: string = EventEndpoints.ComerStatusVta;
  constructor() {
    super();
    this.microservice = EventEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IComerSaleStatus>> {
    return this.get<IListResponse<IComerSaleStatus>>(this.endpoint, params);
  }

  getAllWithFilters(
    params?: string
  ): Observable<IListResponse<IComerSaleStatus>> {
    return this.get<IListResponse<IComerSaleStatus>>(this.endpoint, params);
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.get(route);
  }

  checkExistingId(id: string | number): Observable<boolean> {
    const route = `${this.endpoint}/${id}`;
    return this.get(route).pipe(
      map(() => {
        return true;
      }),
      catchError(() => of(false))
    );
  }

  create(tpenalty: IComerSaleStatus) {
    return this.post(this.endpoint, tpenalty);
  }

  update(id: string | number, tpenalty: IComerSaleStatus) {
    const route = `${this.endpoint}/${id}`;
    return this.put(route, tpenalty);
  }

  remove(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.delete(route);
  }
}

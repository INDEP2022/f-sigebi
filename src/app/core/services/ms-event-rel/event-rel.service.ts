import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventRelatedEndpoints } from 'src/app/common/constants/endpoints/ms-event-rel-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class EventRelatedService extends HttpService {
  constructor() {
    super();
    this.microservice = EventRelatedEndpoints.BasePath;
  }

  private makeParams(params: ListParams | string): HttpParams {
    if (typeof params === 'string') {
      return new HttpParams({ fromString: params });
    }
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }

  // getEventRelsByUser(id: string | number, params?: ListParams) {
  getEventRelsByUser(_params: ListParams | string) {
    console.log('Parametros recibidos: ', _params);

    const params = this.makeParams(_params);

    // const route = `${EventRelatedEndpoints.FindAll}?filter.user=${id}`;
    // const route = `${EventRelatedEndpoints.FindAll}?search=${encodeURI(
    //   params.get('text')
    // )}&limit=${params.get('limit')}&page=${params.get('page')}&filter.assignees=$ilike:${params.get('others')}`;

    const route = `${EventRelatedEndpoints.FindAll}`;

    console.log('Route: ', route);

    // return this.get(route, params);
    return this.get(route, _params);
  }

  createEventRel(body: Object): Observable<any> {
    return this.post<any>(EventRelatedEndpoints.Create, body);
  }

  getAll(params: ListParams | string): Observable<any> {
    return this.get<any>(EventRelatedEndpoints.FindAll, params);
  }

  update(id: number | string, body: Object): Observable<any> {
    return this.put<any>(`${EventRelatedEndpoints.Update}/${id}`, body);
  }

  remove(id: number | string): Observable<any> {
    return this.delete(`${EventRelatedEndpoints.Delete}/${id}`);
  }
}

import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskEndpoints } from 'src/app/common/constants/endpoints/ms-task-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService extends HttpService {
  constructor() {
    super();
    this.microservice = TaskEndpoints.BasePath;
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

  // getTasksByUser(id: string | number, params?: ListParams) {
  getTasksByUser(_params: ListParams | string) {
    const params = this.makeParams(_params);

    // const route = `${TaskEndpoints.FindAll}?filter.user=${id}`;
    const route = `${TaskEndpoints.FindAll}?search=${encodeURI(
      params.get('text')
    )}&limit=${params.get('limit')}&page=${params.get(
      'page'
    )}&filter.assignees=$ilike:${params.get('others')}`;

    // return this.get(route, params);
    return this.get(route);
  }

  createTask(body: Object): Observable<any> {
    return this.post<any>(TaskEndpoints.Create, body);
  }

  getAll(params: ListParams): Observable<any> {
    return this.get<any>(TaskEndpoints.FindAll, params);
  }

  update(id: number | string, body: Object): Observable<any> {
    return this.put<any>(`${TaskEndpoints.Update}/${id}`, body);
  }
}

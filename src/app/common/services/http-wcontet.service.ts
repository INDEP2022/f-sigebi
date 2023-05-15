import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ListParams } from '../repository/interfaces/list-params';

interface ObjectParams {
  [param: string]:
    | string
    | number
    | boolean
    | readonly (string | number | boolean)[];
}

export type _Params = string | HttpParams | ListParams | ObjectParams;

@Injectable({
  providedIn: 'root',
})
export class HttpWContentService {
  private readonly url = environment.API_CONTENT;
  //private readonly prefix = environment.URL_PREFIX;
  protected httpClient = inject(HttpClient);
  protected microservice: string;
  constructor() {}

  protected get<T = any>(route: string, _params?: _Params) {
    const params = this.getParams(_params);
    const url = this.buildRoute(route);
    return this.httpClient.get<T>(`${url}`, { params });
  }

  protected post<T = any>(route: string, body: {}, _params?: _Params) {
    const params = this.getParams(_params);
    const url = this.buildRoute(route);
    return this.httpClient.post<T>(`${url}`, body, { params });
  }

  /*protected put<T = any>(route: string, body?: {}, _params?: _Params) {
    const params = this.getParams(_params);
    const url = this.buildRoute(route);
    console.log(url);
    return this.httpClient.put<T>(`${url}`, body, { params });
  }

  protected patch<T = any>(route: string, body: {}, _params?: _Params) {
    const params = this.getParams(_params);
    const url = this.buildRoute(route);
    return this.httpClient.patch<T>(`${url}`, body, { params });
  }

  protected delete<T = any>(route: string, body?: {}, _params?: _Params) {
    const params = this.getParams(_params);
    const url = this.buildRoute(route);
    return this.httpClient.delete<T>(`${url}`, { params, body });
  }*/

  /**
   *
   * @param route endpoint que va despues de ....api/v1
   * @returns regresa la ruta completa: 'http://sigebimsqa.indep.gob.mx/microservice/api/{route}'
   */
  private buildRoute(route: string): string {
    return `${this.url}${this.microservice}/${route}`;
  }

  /**
   *
   * @param rawParams query params de la ruta
   * @returns regresa una instancia de HttpParams
   */
  private getParams(rawParams: _Params) {
    if (rawParams instanceof HttpParams) {
      return rawParams;
    }

    if (typeof rawParams === 'string') {
      return new HttpParams({ fromString: rawParams });
    }

    if (rawParams instanceof ListParams) {
      return new HttpParams({ fromObject: rawParams });
    }

    return new HttpParams({ fromObject: rawParams });
  }
}

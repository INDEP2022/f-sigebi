import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import {
  IDictamina,
  IUserLevelData,
} from 'src/app/pages/general-processes/indicators/consolidated/consolidated/consolidated-columns';
import { environment } from 'src/environments/environment';
import { ListParams } from '../repository/interfaces/list-params';

@Injectable({
  providedIn: 'root',
})
export class DictaminacionService {
  constructor(private http: HttpClient) {}

  public paramsToSend = new BehaviorSubject<ListParams>(new ListParams());
  paramsDictamina = this.paramsToSend.asObservable();

  getDictamina(params?: ListParams): Observable<IListResponse<IDictamina>> {
    const route = 'indicatorgood/api/v1/ind-consolid';
    return this.http.get<IListResponse<IDictamina>>(
      `${environment.API_URL}${route}`,
      { params }
    );
  }

  setParamsDictaminacion(data: ListParams) {
    this.paramsToSend.next(data);
  }

  getUserLevel(params: string) {
    const route = `users/api/v1/ind-user/get-inicializa-forma?toolbar_user=${params}`;
    return this.http.get<IUserLevelData>(`${environment.API_URL}${route}`);
  }
}

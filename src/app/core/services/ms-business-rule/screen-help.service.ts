import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScreenHelpEndpoint } from 'src/app/common/constants/endpoints/ms-screen-help-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IScreenHelp,
  IScreenHelpTwo,
} from '../../models/ms-business-rule/screen-help.model';

@Injectable({
  providedIn: 'root',
})
export class ScreenHelpService extends HttpService {
  private readonly endpoint = 'help-x-screen';
  constructor() {
    super();
    this.microservice = 'businessrule';
  }

  getById(id: string) {
    return this.get<IScreenHelp>(`${this.endpoint}/${id}`);
  }

  getAll(params?: _Params): Observable<IListResponse<IScreenHelp>> {
    return this.get<IListResponse<IScreenHelp>>(
      ScreenHelpEndpoint.IndBusinessRule,
      params
    );
  }
  getHelpScreen(screen: string) {
    return this.get<IScreenHelpTwo>(`${this.endpoint}/${screen}`);
  }
}

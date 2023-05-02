import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { IScreenHelp } from '../../models/ms-business-rule/screen-help.model';

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
}

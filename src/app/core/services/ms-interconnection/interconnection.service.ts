import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { Iinterconnection } from '../../models/ms-interconnection/interconnection-model';

@Injectable({
  providedIn: 'root',
})
export class SendClarificationService extends HttpService {
  constructor() {
    super();
    this.microservice = 'interconnection';
  }

  generateCve(model: Iinterconnection) {
    const route = `application/send-clarification`;
    return this.post<IListResponse<Iinterconnection>>(route, model);
  }
}

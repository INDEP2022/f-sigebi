import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
@Injectable({
  providedIn: 'root',
})
export class EventProgrammingService extends HttpService {
  constructor() {
    super();
    this.microservice = 'eventprogramming';
  }

  getFolio(body: any) {
    return this.post<{ folio: string }>('functions/get-folio', body);
  }

  valUserInd(body: any) {
    return this.post<{ level: string }>('functions/fa-val-user-ind', body);
  }
}

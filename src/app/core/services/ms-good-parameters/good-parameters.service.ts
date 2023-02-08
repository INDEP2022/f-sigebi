import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGood } from '../../models/ms-good/good';

@Injectable({
  providedIn: 'root',
})
export class GoodParametersService extends HttpService {
  constructor() {
    super();
    this.microservice = 'parametergood';
  }

  getPhaseEdo(): Observable<IListResponse<IGood>> {
    const today = new Date().toISOString();
    const params = { date: today };
    return this.get('Parameters/fa-stage-creda', params);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { IGoodParameter } from '../../models/ms-good-parameter/good-parameter.model';

@Injectable({
  providedIn: 'root',
})
export class GoodParametersService extends HttpService {
  constructor() {
    super();
    this.microservice = 'parametergood';
  }

  getPhaseEdo(): Observable<{ stagecreated: number }> {
    const today = new Date().toISOString();
    const params = { date: today };
    return this.get('parameters/fa-stage-creda', params);
  }

  getById(parameter: string) {
    return this.get<IGoodParameter>(`parameters/${parameter}`);
  }
}

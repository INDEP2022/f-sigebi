import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { ExpedientEndpoints } from '../../../common/constants/endpoints/ms-expedient-endpoints';
import { ITempExpedient } from '../../models/ms-expedient/tmp-expedient.model';

@Injectable({
  providedIn: 'root',
})
export class TmpExpedientService extends HttpService {
  private readonly route = ExpedientEndpoints;
  constructor() {
    super();
    this.microservice = this.route.BasePath;
  }

  getById(id: string | number): Observable<ITempExpedient> {
    const route = `${this.route.GetTempExpedient}/${id}`;
    return this.get(route);
  }

  create(body: ITempExpedient) {
    return this.post(this.route.CreateTempExpedient, body);
  }

  remove(id: string | number) {
    const route = `${this.route.DeleteTempExpedient}/${id}`;
    return this.delete(route);
  }
}

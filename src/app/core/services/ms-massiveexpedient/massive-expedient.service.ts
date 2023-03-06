import { Injectable } from '@angular/core';
import { MassiveExpedientEndpoints } from 'src/app/common/constants/endpoints/ms-massive-exedient';
import { HttpService } from 'src/app/common/services/http.service';
interface IDepurateBody {
  previousExpedient: string | number;
  newExpedient: string | number;
}
@Injectable({
  providedIn: 'root',
})
export class MassiveExpedientService extends HttpService {
  constructor() {
    super();
    this.microservice = MassiveExpedientEndpoints.Base;
  }

  depurateExpedient(body: IDepurateBody) {
    return this.post(MassiveExpedientEndpoints.DepurateExpedient, body);
  }

  deleteExpedient(expedientNum: string | number) {
    const route = `${MassiveExpedientEndpoints.DeleteExpedient}/${expedientNum}`;
    return this.post(route, {});
  }
}

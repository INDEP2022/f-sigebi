import { Injectable } from '@angular/core';
import { RequestEndpoint } from 'src/app/common/constants/endpoints/ms-request';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class RequestsService extends HttpService {
  constructor() {
    super();
    this.microservice = RequestEndpoint.BasePath;
  }

  spMantenimeto(body: {
    parameter: string;
    data: string;
    valueNumber?: string;
    charValue?: string;
  }) {
    return this.post(RequestEndpoint.SP_MANTENIMINETO, body);
  }
}

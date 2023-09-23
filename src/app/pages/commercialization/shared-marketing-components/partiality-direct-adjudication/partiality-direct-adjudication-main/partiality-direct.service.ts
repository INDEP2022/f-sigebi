import { Injectable } from '@angular/core';
import { ENDPOINT_LINKS } from 'endpoints';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class PartialityDirectService extends HttpService {
  constructor() {
    super();
    this.microservice = ENDPOINT_LINKS.parameterComerValidBidding;
  }
}

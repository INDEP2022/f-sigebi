import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { IFraccion } from '../../models/ms-good/fraccion';

@Injectable({
  providedIn: 'root',
})
export class FractionsService extends HttpService {
  private readonly endpoint: string = ENDPOINT_LINKS.FractionS;
  private readonly find: string = ENDPOINT_LINKS.SubTypeGood;
  constructor() {
    super();
    this.microservice = ENDPOINT_LINKS.FractionS;
  }
  findByFraction(search: any) {
    const route = `${this.find}${search}`;
    return this.get(route);
  }
  update(fraction: IFraccion) {
    const route = `${this.endpoint}`;
    return this.put(route, fraction);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NumeraryEndpoints } from 'src/app/common/constants/endpoints/ms-numerary';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class NumeraryService extends HttpService {
  private readonly route = NumeraryEndpoints;
  constructor() {
    super();
    this.microservice = this.route.Numerary;
  }

  validateCvs(body: any): Observable<any> {
    return this.get(this.route.ValidateCvs, body);
  }
}

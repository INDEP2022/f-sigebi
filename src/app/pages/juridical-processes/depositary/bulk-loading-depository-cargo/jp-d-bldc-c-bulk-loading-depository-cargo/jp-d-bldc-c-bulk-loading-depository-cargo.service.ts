import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JpDBldcCBulkLoadingDepositoryCargoService {
  constructor(private htpp: HttpClient) {}

  postDedPayDepositary(body: any): Observable<any> {
    const url = `${environment.API_URL}depositary/api/v1/ded-pay-depositary`;
    return this.htpp.post(url, body);
  }
  postDetrepoDepositary(body: any): Observable<any> {
    const url = `${environment.API_URL}depositary/api/v1/detrepo-depositary`;
    return this.htpp.post(url, body);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ProgrammingRequestService {
  constructor(private http: HttpClient) {}

  getUserInfo() {
    return this.http.get(`${environment.api_external_userInfo}`);
  }

  /*getAllRegionalDelegations(
    params?: ListParams
  ): Observable<IRegionalDelegation> {
    return this.http.get<IRegionalDelegation>(
      `${environment.API_URL}regional-delegation`
    );
  } */
}

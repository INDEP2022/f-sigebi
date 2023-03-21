import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TypesOfClaimsService {
  constructor(private htpp: HttpClient) {}

  getClaims() {
    const url = `${environment.API_URL}catalog/api/v1/type-sinisters`;
    return this.htpp.get(url);
  }

  postClaims(body: any) {
    const url = `${environment.API_URL}catalog/api/v1/type-sinisters`;
    return this.htpp.post(url, body);
  }

  PutClaim(idClaim: string, body: any) {
    const url = `${environment.API_URL}catalog/api/v1/type-sinisters`;
    return this.htpp.put(url, body);
  }

  deleteClaims(idClaim: string) {
    const url = `${environment.API_URL}catalog/api/v1/type-sinisters`;
    return this.htpp.delete(url);
  }
}

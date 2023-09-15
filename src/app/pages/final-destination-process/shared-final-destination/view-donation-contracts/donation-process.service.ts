import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DonationEndPoint } from 'src/app/common/constants/endpoints/ms-donation';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DonationProcessService extends HttpService {
  private donaciones: string = DonationEndPoint.requets;
  private fdonacDocumAdm1: string = DonationEndPoint.fdonacDocumAdm1;

  constructor() {
    super();
    this.microservice = 'donationgood';
  }

  getAllContracts(filtro?: string): Observable<any> {
    console.log('obtener contratos');
    let params = filtro;
    return this.httpClient.get<any>(
      `${environment.API_URL}donationgood/api/v1/${this.donaciones}?${params}`
    );
  }

  getDataInventario(filtro?: string): Observable<any> {
    let params = filtro;
    return this.httpClient.get<any>(
      `${environment.API_URL}donationgood/api/v1/${this.fdonacDocumAdm1}?${params}`
    );
  }
}

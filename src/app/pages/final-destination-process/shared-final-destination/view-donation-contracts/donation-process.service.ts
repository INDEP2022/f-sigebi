import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DonationEndPoint } from 'src/app/common/constants/endpoints/ms-donation';
import { HttpService } from 'src/app/common/services/http.service';
import { IRequest } from 'src/app/core/models/sirsae-model/proposel-model/proposel-model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DonationProcessService extends HttpService {
  private donaciones: string = DonationEndPoint.requets;
  private fdonacDocumAdm1: string = DonationEndPoint.fdonacDocumAdm1;
  private requets: string = DonationEndPoint.requets;

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

  getContrato(params: string): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.API_URL}donationgood/api/v1/${this.requets}?filter.requestId.id=$eq:${params}`
    );
  }

  updateSolicitudDonacion(params: number): Observable<any> {
    return this.httpClient.put<any>(
      `${environment.API_URL}donationgood/api/v1/donac-request-good`,
      params
    );
  }

  getRequestId(id: number) {
    const route = `${this.requets}?filter.requestId.id=$eq:${id}`;
    return this.get(route);
  }
  createRequest(model: IRequest) {
    const route = `${this.requets}`;
    return this.post(route, model);
  }
}

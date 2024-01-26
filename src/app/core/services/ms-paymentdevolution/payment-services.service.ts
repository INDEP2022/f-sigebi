import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentDevolutionEndPoints } from 'src/app/common/constants/endpoints/ms-paymentdevolution.services';
import { InterceptorSkipHeader } from 'src/app/common/interceptors/http-errors.interceptor';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { AuthService } from '../authentication/auth.service';
import { IApplicationFComerCtldPag3 } from '../ms-payment/payment-service';

@Injectable({
  providedIn: 'root',
})
export class PaymentDevolutionService extends HttpService {
  // private readonly url = environment.API_REPORTS;
  // protected readonly prefix = environment.URL_PREFIX;

  constructor(private http: HttpClient, private authService: AuthService) {
    super();
    this.microservice = PaymentDevolutionEndPoints.BasePath;
  }

  getCtlDevPagH(params: _Params) {
    return this.get(`${PaymentDevolutionEndPoints.EatCtldevpagH}`, params);
  }

  getEatCtlPagE(params: ListParams) {
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    this.authService.setReportFlag(true);
    const route = `${this.url}${this.microservice}/${this.prefix}${PaymentDevolutionEndPoints.EatCtlPagE}`;
    return this.http.get<any>(`${route}`, {
      headers,
      params,
      // responseType: 'arraybuffer' as 'json',
    });
  }
  getCtlDevPagP(params: _Params) {
    return this.get(`${PaymentDevolutionEndPoints.ComerCtldevpagP}`, params);
  }
  getEatCtlCreate(user: string) {
    return this.get(`${PaymentDevolutionEndPoints.EatCtlCreate}/${user}`);
  }
  getFComerCtldPag3(body: IApplicationFComerCtldPag3) {
    return this.post(
      `${PaymentDevolutionEndPoints.ApplicationFComerCtldPag3}`,
      body
    );
  }

  getEatCtlCreate_(params: _Params) {
    return this.get(`${PaymentDevolutionEndPoints.EatCtlCreate}`, params);
  }
  createEatCtlCreate_(data: any) {
    return this.post(`${PaymentDevolutionEndPoints.EatCtlCreate}`, data);
  }
  putEatCtlCreate_(data: any, user: string) {
    return this.put(`${PaymentDevolutionEndPoints.EatCtlCreate}/${user}`, data);
  }
  deleteEatCtlCreate_(data: any, user: string) {
    return this.delete(
      `${PaymentDevolutionEndPoints.EatCtlCreate}/${user}`,
      data
    );
  }
}

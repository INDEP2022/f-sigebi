import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeliveryConstancy } from 'src/app/common/constants/endpoints/ms-delivery-constancy-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { CertificatesGoodsEndpoints } from '../../models/ms-delivery-constancy/ms-delivery-constancy-model';

@Injectable({
  providedIn: 'root',
})
export class CertificatesGoodsService extends HttpService {
  constructor(private http: HttpClient) {
    super();
    this.microservice = DeliveryConstancy.Base;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<CertificatesGoodsEndpoints>> {
    return this.get<IListResponse<CertificatesGoodsEndpoints>>(
      DeliveryConstancy.CertificatesGood,
      params
    );
  }

  create(body: CertificatesGoodsEndpoints) {
    return this.post(DeliveryConstancy.CertificatesGood, body);
  }

  /* update(good: IGood | any) {
    const route = `${GoodEndpoints.Good}`;
    return this.put(route, good);
  }


  remove(id: string | number) {
    const route = `${GoodEndpoints.Good}/${id}`;
    return this.delete(route);
  } */
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SamplingOrderEndpoint } from 'src/app/common/constants/endpoints/ms-sampling-order-endpoint';
import { IAnnexesW } from 'src/app/common/repository/interfaces/annexes-w-interface';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({ providedIn: 'root' })
export class SamplingOrderService extends HttpService {
  private readonly endpoint = SamplingOrderEndpoint;

  constructor(private http: HttpClient) {
    super();
    this.microservice = SamplingOrderEndpoint.BasePath;
  }

  postAnnexesW(formData: IAnnexesW) {
    return this.post(SamplingOrderEndpoint.AnnexW, formData);
  }
}

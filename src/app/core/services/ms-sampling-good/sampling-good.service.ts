import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SamplingGoodEndpoint } from 'src/app/common/constants/endpoints/sampling-good-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISample } from '../../models/ms-goodsinv/sample.model';
import { ISamplingGood } from '../../models/ms-goodsinv/sampling-good-view.model';

@Injectable({ providedIn: 'root' })
export class SamplingGoodService extends HttpService {
  private samplingGoodEndpoint = SamplingGoodEndpoint;

  constructor() {
    super();
    this.microservice = SamplingGoodEndpoint.BasePath;
  }

  getSample(_params: ListParams): Observable<IListResponse<ISample>> {
    const params = this.makeParams(_params);
    return this.get<IListResponse<ISample>>(
      `${this.samplingGoodEndpoint.Sample}?${params}`
    );
  }

  getSamplingGoods(
    _params: ListParams
  ): Observable<IListResponse<ISamplingGood>> {
    const params = this.makeParams(_params);
    return this.get<IListResponse<ISamplingGood>>(
      `${this.samplingGoodEndpoint.SamplingGood}?${params}`
    );
  }

  createSamplingGood(formData: ISamplingGood) {
    return this.post(this.samplingGoodEndpoint.SamplingGood, formData);
  }

  createSample(sample: ISample) {
    return this.post(this.samplingGoodEndpoint.Sample, sample);
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}

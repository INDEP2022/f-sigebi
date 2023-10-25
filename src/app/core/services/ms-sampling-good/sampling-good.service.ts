import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SamplingGoodEndpoint } from 'src/app/common/constants/endpoints/sampling-good-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISample } from '../../models/ms-goodsinv/sample.model';

import {
  ISampleGood,
  ISamplingGoodView,
} from '../../models/ms-goodsinv/sampling-good-view.model';
import { ISamplingDeductive } from '../../models/ms-sampling-good/sampling-deductive.model';

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

  createSample(sample: ISample) {
    return this.post(this.samplingGoodEndpoint.Sample, sample);
  }

  updateSample(sample: ISample) {
    return this.put(this.samplingGoodEndpoint.Sample, sample);
  }

  getSamplingGoods(
    _params: ListParams
  ): Observable<IListResponse<ISampleGood>> {
    const params = this.makeParams(_params);
    return this.get<IListResponse<ISampleGood>>(
      `${this.samplingGoodEndpoint.SamplingGood}?${params}`
    );
  }

  createSamplingGood(formData: ISampleGood) {
    return this.post(this.samplingGoodEndpoint.SamplingGood, formData);
  }

  editSamplingGood(sampleGood: ISampleGood) {
    return this.put(this.samplingGoodEndpoint.SamplingGood, sampleGood);
  }
  deleteSamplingGood(id: number) {
    return this.delete(`${this.samplingGoodEndpoint.SamplingGood}/${id}`);
  }

  /* DEDUCTIVER */
  getAllSampleDeductives(
    params?: ListParams | string
  ): Observable<IListResponse<ISamplingDeductive>> {
    const route = SamplingGoodEndpoint.SamplingDeductives;
    return this.get<IListResponse<ISamplingDeductive>>(route, params);
  }

  getSampleDeductiveById(id: number) {
    const route = `${SamplingGoodEndpoint.SamplingDeductives}/${id}`;
    return this.get<IListResponse<ISamplingDeductive>>(route);
  }

  createSampleDeductive(body: ISamplingDeductive) {
    const route = SamplingGoodEndpoint.SamplingDeductives;
    return this.post<IListResponse<ISamplingDeductive>>(route, body);
  }

  updateSampleDeductive(body: ISamplingDeductive) {
    const route = SamplingGoodEndpoint.SamplingDeductives;
    return this.put<IListResponse<ISamplingDeductive>>(route, body);
  }

  deleteSampleDeductive(id: number) {
    const route = `${SamplingGoodEndpoint.SamplingDeductives}/${id}`;
    return this.delete<IListResponse<ISamplingDeductive>>(route);
  }

  getSamplingGoodFilter(
    _params: ListParams
  ): Observable<IListResponse<ISamplingGoodView>> {
    const params = this.makeParams(_params);
    const route = `${SamplingGoodEndpoint.SamplingGoodFilter}?${params}`;
    return this.get<IListResponse<ISamplingGoodView>>(route);
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}

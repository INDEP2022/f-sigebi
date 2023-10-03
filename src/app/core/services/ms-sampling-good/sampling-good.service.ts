import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SamplingGoodEndpoints } from 'src/app/common/constants/endpoints/sampling-good-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISamplingDeductive } from '../../models/ms-sampling-good/sampling-deductive.model';

@Injectable({
  providedIn: 'root',
})
export class SamplingGoodService extends HttpService {
  constructor() {
    super();
    this.microservice = SamplingGoodEndpoints.Base;
  }

  getAllSampleDeductives(
    params?: ListParams | string
  ): Observable<IListResponse<ISamplingDeductive>> {
    const route = SamplingGoodEndpoints.SamplingDeductives;
    return this.get<IListResponse<ISamplingDeductive>>(route, params);
  }

  getSampleDeductiveById(id: number) {
    const route = `${SamplingGoodEndpoints.SamplingDeductives}/${id}`;
    return this.get<IListResponse<ISamplingDeductive>>(route);
  }

  createSampleDeductive(body: ISamplingDeductive) {
    const route = SamplingGoodEndpoints.SamplingDeductives;
    return this.post<IListResponse<ISamplingDeductive>>(route, body);
  }

  updateSampleDeductive(body: ISamplingDeductive) {
    const route = SamplingGoodEndpoints.SamplingDeductives;
    return this.put<IListResponse<ISamplingDeductive>>(route, body);
  }

  deleteSampleDeductive(id: number) {
    const route = `${SamplingGoodEndpoints.SamplingDeductives}/${id}`;
    return this.put<IListResponse<ISamplingDeductive>>(route);
  }
}

import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ProceedingsEndpoints } from './../../../common/constants/endpoints/ms-proceedings-endpoints';
import { IDetailProceedingsDevolution } from './../../models/ms-proceedings/detail-proceedings-devolution.model';

@Injectable({
  providedIn: 'root',
})
export class DetailProceedingsDevolutionService extends HttpService {
  private readonly endpoint = ProceedingsEndpoints.DetailProceedingsDevollution;
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
  }

  getDetailProceedingsDevolutionByExpedient(
    fileNumber: string | number,
    params?: ListParams
  ) {
    return this.get<IListResponse<IDetailProceedingsDevolution>>(
      `${this.endpoint}?filter.good.fileId=${fileNumber}`
    );
  }
}

import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { ProceedingsEndpoints } from '../../../common/constants/endpoints/ms-proceedings-endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IMaximumClosingTime } from '../../models/ms-proceedings/maximum-closing-time.model';

@Injectable({
  providedIn: 'root',
})
export class MaximunClosingTimeService extends HttpService {
  private readonly endpoint = ProceedingsEndpoints.MaximunClosingTime;
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
  }

  getByProceedingsType(proceedingsType: string, params?: ListParams) {
    return this.get<IListResponse<IMaximumClosingTime>>(
      `${this.endpoint}/${proceedingsType}`,
      params
    );
  }

  // getDetailProceedingsDevolutionByExpedient(
  //   fileNumber: string | number,
  //   params?: ListParams
  // ) {
  //   return this.get<IListResponse<IDetailProceedingsDevolution>>(
  //     `${this.endpoint}?filter.good.fileId=${fileNumber}`
  //   );
  // }
}

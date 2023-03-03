import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ProceedingsEndpoints } from './../../../common/constants/endpoints/ms-proceedings-endpoints';
import { IDetailProceedingsDevolution2 } from './../../models/ms-proceedings/detail-proceedings2-devolution.model';
import { ITotalReconciledGoods } from './../../models/ms-proceedings/total-reconciled-goods.model';

@Injectable({
  providedIn: 'root',
})
export class DetailProceedingsDevolutionService extends HttpService {
  private readonly endpoint = ProceedingsEndpoints.DetailProceedingsDevollution;
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
  }

  getDetailProceedingsDevolutionByProceedingsNumb(
    proceedingsNumb: string | number,
    params?: ListParams
  ) {
    return this.get<IListResponse<IDetailProceedingsDevolution2>>(
      `${this.endpoint}?filter.numGoodProceedingsId=${proceedingsNumb}`,
      params
    );
  }

  getTotalReconciledGoods(proceedingId: string | number) {
    return this.get<IListResponse<ITotalReconciledGoods>>(
      `${this.endpoint}/get-total-movement-accounts-by-proceeding/${proceedingId}`
    );
  }
}

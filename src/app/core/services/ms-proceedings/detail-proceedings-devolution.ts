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
  private readonly endpoint2 = ProceedingsEndpoints.ProeedingsDevolution;
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

  getAllProceedingsDevolution(params?: ListParams) {
    return this.get<IListResponse<any>>(
      ProceedingsEndpoints.ProeedingsDevolutionCustome,
      params
    );
  }

  getAll(params?: ListParams) {
    return this.get<IListResponse<any>>(this.endpoint, params);
  }
  getAllByActNumber(params?: ListParams) {
    return this.get<IListResponse<any>>(
      `${this.endpoint}?filter.numGoodProceedingsId=${params['numGoodProceedingsId']}`,
      params
    );
  }
  getTotalReconciledGoods(proceedingId: string | number) {
    return this.get<IListResponse<ITotalReconciledGoods>>(
      `${this.endpoint}/get-total-movement-accounts-by-proceeding/${proceedingId}`
    );
  }
  getRecepcionProcedings(params: string | number) {
    return this.get<IListResponse<any>>(
      `${this.endpoint}?filter.numGoodId=${params}`
    );
  }

  updateProcedings(id: any, body: any) {
    console.log(id, body);
    return this.put<IListResponse<any>>(`${this.endpoint}/${id}`, body);
  }
}

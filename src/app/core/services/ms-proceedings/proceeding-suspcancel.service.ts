import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { ProceedingsEndpoints } from '../../../common/constants/endpoints/ms-proceedings-endpoints';

@Injectable({
  providedIn: 'root',
})
export class ProceedingSusPcancelService extends HttpService {
  private readonly endpoint = ProceedingsEndpoints.MaximunClosingTime;
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.proceedingsuspcancel;
  }

  suspcancel(user: any) {
    const route = `${ProceedingsEndpoints.suspCancel}?filter.status=$ilike:XXX&filter.regusr=$ilike:${user}`;
    return this.get(route);
  }

  tmpValGoodConst(params: any) {
    return this.get('tmp-val-goodconst', params);
  }

  queryTransferKey(body: { proceedingsNumber: string; typeMinutes: string }) {
    return this.post('application/query-transfer-key', body);
  }

  queryRNomencla(delegation: string, params?: any) {
    return this.get(`application/query-r-nomencla/${delegation}`, params);
  }

  postQuery(body: IPostQueryGoodFACTCIRCUN_0001) {
    return this.post('application/process-factcircun', body);
  }

  deleteProceeding(proceding: string) {
    return this.delete(`application/pupDelDeliveryCertificate/${proceding}`);
  }

  validateGoods(proceeding: string) {
    return this.get(`application/process-blk-det-factcircun/${proceeding}`);
  }

  preblockListProceedings(procceding: string) {
    return this.get(`application/process-minute-list-factcircun/${procceding}`);
  }

  pupLaunchReport(body: IPupLaunchReport) {
    return this.post('application/pup-launches-report', body);
  }

  searchBievnr(body: IBlkBienvnr) {
    return this.post('application/process-BLK-bievnr', body);
  }

  insertGoodsFactcircun(body: { BLK_BIEVNR: IBlkBieVrnDto[] }) {
    return this.post('application/process-blk-bievnr-factcircun', body);
  }
}

export interface IPostQueryGoodFACTCIRCUN_0001 {
  elaborationDate: Date | null;
  delegationNumber: string;
  subdelegationNumber: string;
  goodNumber: number;
  proceedingsNumber: number;
  status: string;
  screen: string;
}

export interface IPupLaunchReport {
  minuteList: string;
  minutesNumber: string;
  proceedingsNumber: string;
}

export interface IBlkBienvnr {
  filterBy: number;
  eventId: number;
  searchValue: string;
}

export interface IBlkBieVrnDto {
  goodNumber: number;
  classificationNumber: number;
  diDescriptionProperty: string;
  processExtDom: string;
  amount: number;
  unitM: string;
}

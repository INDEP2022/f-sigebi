import { Injectable } from '@angular/core';
import { IDescriptionByNoGoodBody } from 'src/app/core/models/good/good.model';
import {
  ISendSirSaeBody,
  ITotalAmountRefPayments,
  ITotalIvaPaymentsGens,
} from 'src/app/core/models/ms-depositarypayment/ms-depositarypayment.interface';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import {
  NumBienShare,
  valorBien,
} from 'src/app/core/services/ms-depositary/num-bien-share.services';
import { MsDepositaryPaymentService } from 'src/app/core/services/ms-depositarypayment/ms-depositarypayment.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MsMassivecapturelineService } from 'src/app/core/services/ms-massivecaptureline/ms-massivecaptureline.service';

@Injectable({
  providedIn: 'root',
})
export class QueryRelatedPaymentsService {
  constructor(
    private msMsDepositaryPaymentService: MsDepositaryPaymentService,
    private msDepositaryService: MsDepositaryService,
    private msGoodService: GoodService,
    private msMsMassivecapturelineService: MsMassivecapturelineService,
    private svNumBienShare: NumBienShare
  ) {}

  sendSirsae(params: ISendSirSaeBody) {
    return this.msMsDepositaryPaymentService.sendSirsae(params);
  }
  getGoodAppointmentDepositaryByNoGood(params: string) {
    return this.msDepositaryService.getAllFiltered(params);
  }
  getGoodDataByFilter(body: string) {
    return this.msGoodService.getAllFilter(body);
  }
  getDescriptionGoodByNoGood(body: IDescriptionByNoGoodBody) {
    return this.msGoodService.getDescriptionGoodByNoGood(body);
  }
  getRefPayDepositories(params: string) {
    return this.msMsDepositaryPaymentService.getRefPayDepositories(params);
  }
  getPaymentsGensDepositories(params: string) {
    return this.msMsDepositaryPaymentService.getPaymentsGensDepositories(
      params
    );
  }
  getPaymentsGensDepositoriesTotals(params: ITotalIvaPaymentsGens) {
    return this.msMsDepositaryPaymentService.getPaymentsGensDepositoriesTotals(
      params
    );
  }
  getRefPayDepositoriesTotals(params: ITotalAmountRefPayments) {
    return this.msMsDepositaryPaymentService.getRefPayDepositoriesTotals(
      params
    );
  }
  getExportExcell(goodNumber: number) {
    return this.msMsMassivecapturelineService.getRefPayDepositories(goodNumber);
  }
  setGoodParamGood(goodNumber: number, screenKey: string) {
    let valGood: valorBien = {
      nomPantall: screenKey,
      numBien: goodNumber,
      cveContrato: '',
      depositario: '',
      desc: '',
    };
    //this.svNumBienShare.SharingNumbienData = valGood;
    console.log(
      this.svNumBienShare.SharingNumbien,
      valGood,
      this.svNumBienShare.SharingNumbienData
    );
  }
}

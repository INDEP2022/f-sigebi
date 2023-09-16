import { inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { IComerEventAppraisal } from 'src/app/core/models/ms-parametercomer/comer-event-appraisal.model';
import { BasePage } from 'src/app/core/shared';
import { AppraisalEventForm } from '../utils/appaisal-event-form';
export interface IAppraisalRegGlobal {
  direction: 'M' | 'I';
  vIva: string;
  vColumnNum: string;
}
export class AppraisalRegistrationMain extends BasePage {
  global: IAppraisalRegGlobal = {
    direction: null,
    vIva: '',
    vColumnNum: '',
  };
  fb = inject(FormBuilder);
  comerEventForm = this.fb.group(new AppraisalEventForm());
  screen: string;
  searchGoods = new Subject<string | number>();
  $selectedAppraisal = new BehaviorSubject<IComerEventAppraisal>(null);
  $showRejected = new BehaviorSubject(false);
  $appraisedRejectedList = new BehaviorSubject([]);
  $appraisedRejectedDList = new BehaviorSubject([]);
  $appraisedRejectedGoodsList = new BehaviorSubject([]);
  $appraisedRejectedGoodsDList = new BehaviorSubject([]);
  $rejectedDisscount = new BehaviorSubject(false);
  $downloadGoodsFormat = new Subject<void>();
}

import { Component, inject, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  Subject,
  throwError,
} from 'rxjs';
import { IComerEventAppraisal } from 'src/app/core/models/ms-parametercomer/comer-event-appraisal.model';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { BasePage } from 'src/app/core/shared';
import { UNEXPECTED_ERROR } from 'src/app/utils/constants/common-errors';
import { AppraisalEventForm } from '../utils/appaisal-event-form';
import { IAppraisalRegGlobal } from './appraisal-registration-main';

@Component({
  template: '',
})
export class AppraisalRegistrationChild extends BasePage {
  @Input() comerEventForm: FormGroup<AppraisalEventForm>;
  @Input() global: IAppraisalRegGlobal;
  @Input() screen: string;
  @Input() searchGoods: Subject<string | number>;
  @Input() $selectedAppraisal: BehaviorSubject<IComerEventAppraisal>;
  @Input() $showRejected: BehaviorSubject<boolean>;
  @Input() $appraisedRejectedList: BehaviorSubject<any[]>;
  @Input() $appraisedRejectedDList: BehaviorSubject<any[]>;
  @Input() $appraisedRejectedGoodsList: BehaviorSubject<any[]>;
  @Input() $appraisedRejectedGoodsDList: BehaviorSubject<any[]>;
  @Input() $rejectedDisscount: BehaviorSubject<boolean>;
  @Input() $downloadGoodsFormat: Subject<void>;

  get _controls() {
    return this.comerEventForm.controls;
  }

  private parameterService = inject(ParameterModService);

  // PUF_VAL_EVENTO
  pufValEvent(body: {
    cveDisplay: string;
    pProcess: string;
    pEvent: string | number;
    pTpevent: string | number;
    pCveAppraisal: string;
    pDirection: string;
    ptpoAvalue: string | number;
    pTpodocument: string | number;
    pEstevent: string | number;
  }) {
    return firstValueFrom(
      this.parameterService.pufValService(body).pipe(
        catchError(error => {
          this.onLoadToast('error', UNEXPECTED_ERROR, '');
          return throwError(() => error);
        }),
        map(response => response?.data ?? null)
      )
    );
  }

  getPufValEventBody(pProcess: string, pTpodocument?: string) {
    const { id_evento, id_tpevento, item_desc_tpsolaval } = this._controls;
    const pEstevent: string = null;
    return {
      cveDisplay: this.screen,
      pProcess,
      pEvent: id_evento.value,
      pTpevent: id_tpevento.value,
      pCveAppraisal: '',
      pDirection: this.global.direction,
      ptpoAvalue: item_desc_tpsolaval.value,
      pTpodocument,
      pEstevent,
    };
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  BehaviorSubject,
  catchError,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { PurgingRecordsService } from '../service/purging-records.service';
import { PurginRecordsForm } from '../utils/purgin-records-form';
import { PURGIN_RECORDS_VALIDATION_MESSAGES } from '../utils/validation-messages';
@Component({
  selector: 'app-purging-records',
  templateUrl: './purging-records.component.html',
  styles: [
    `
      .b-content {
        margin-top: -35px;
      }
    `,
  ],
})
export class PurgingRecordsComponent extends BasePage implements OnInit {
  originForm = this.fb.group(new PurginRecordsForm());
  targetForm = this.fb.group(new PurginRecordsForm());
  originGoods: IGood[] = [];
  targetGoods: IGood[] = [];
  originParams = new BehaviorSubject(new ListParams());
  targetParams = new BehaviorSubject(new ListParams());
  isIntegratingExpedient: boolean = false;
  originExpedientExist: boolean = false;
  originExpedient: IExpedient = null;
  targetExpedient: IExpedient = null;

  get originControls() {
    return this.originForm.controls;
  }

  get targetControls() {
    return this.targetForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private expedientService: ExpedientService,
    private goodService: GoodService,
    private purginRecordsService: PurgingRecordsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.targetForm.disable();
    this.targetControls.id.enable();
    this.originParamsMap();
    this.targetParamsMap();
  }

  originParamsMap() {
    this.originParams.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        const expedientId = this.originForm.controls.id.value;
        const params = this.originParams.getValue();
        if (expedientId) {
          this.getGoodsByExpedient(expedientId, params);
        }
      },
    });
  }

  targetParamsMap() {
    this.targetParams.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        const expedientId = this.targetForm.controls.id.value;
        const params = this.targetParams.getValue();
        if (expedientId) {
          this.getGoodsByExpedient(expedientId, params);
        }
      },
    });
  }

  getOriginExpedient(expedientId: string | number) {
    this.getExpedient(expedientId)
      .pipe(
        catchError(error => {
          this.originExpedient = null;
          this.originExpedientExist = false;
          this.originForm.reset();
          this.originGoods = [];
          return throwError(() => error);
        }),
        tap(expedient => {
          this.originExpedientExist = true;
          this.originExpedient = expedient;
          this.originForm.patchValue(expedient);
        }),
        switchMap(expedient => {
          const params = this.originParams.getValue();
          return this.getGoodsByExpedient(expedient.id, params);
        }),
        tap(goods => (this.originGoods = goods.data))
      )
      .subscribe();
  }

  getTargetExpedient(expedientId: string | number) {
    this.getExpedient(expedientId)
      .pipe(
        catchError(error => {
          this.targetExpedient = null;
          this.targetForm.reset();
          this.targetGoods = [];
          return throwError(() => error);
        }),
        tap(expedient => {
          this.targetExpedient = expedient;
          this.targetForm.patchValue(expedient);
        }),
        switchMap(expedient => {
          const params = this.targetParams.getValue();
          return this.getGoodsByExpedient(expedient.id, params);
        }),
        tap(goods => (this.targetGoods = goods.data))
      )
      .subscribe();
  }

  private getExpedient(id: string | number) {
    return this.expedientService.getById(id).pipe(
      catchError(error => {
        if (error.status <= 404) {
          this.onLoadToast('error', 'Error', 'El expediente no existe');
        }
        return throwError(() => error);
      })
    );
  }

  private getGoodsByExpedient(
    expedientId: string | number,
    params: ListParams
  ) {
    return this.goodService.getByExpedient(expedientId, params);
  }

  integrateExpedient() {
    if (!this.originForm.valid && this.originExpedientExist) {
      this.originForm.markAllAsTouched();
      return;
    }
    this.originForm.controls.id.disable();
    this.isIntegratingExpedient = true;
  }

  save() {
    if (!this.originForm.valid || !this.targetForm.valid) {
      this.originForm.markAllAsTouched();
      this.targetForm.markAllAsTouched();
      return;
    }
    this.validate();
    const old = this.originExpedient.id;
    const _new = this.targetExpedient.id;
    this.purginRecordsService.updateAll(old, _new).subscribe();
  }

  updateExpedient() {
    // this.expedientService.
  }

  validate() {
    const _keys = Object.keys(this.originForm.controls);
    const keys = _keys.filter(key => key != 'id');
    for (let index = 0; index < keys.length; index++) {
      const originValue = (this.originExpedient as any)[keys[index]];
      const targetValue = (this.targetExpedient as any)[keys[index]];
      const isValid = this.validateField(originValue, targetValue);
      if (!isValid) {
        this.showValidationError(keys[index]);
        return;
      }
    }

    console.log('paso');
  }

  showValidationError(key: string) {
    const message = PURGIN_RECORDS_VALIDATION_MESSAGES[key];
    this.onLoadToast('error', 'Error', message);
  }

  validateField(origin: string, target: string) {
    if (origin && target) {
      return origin == target;
    }
    return true;
  }
}

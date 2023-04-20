import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  catchError,
  map,
  mergeMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MassiveExpedientService } from 'src/app/core/services/ms-massiveexpedient/massive-expedient.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
  totalOrigin = 0;
  totalTarget = 0;
  isIntegratingExpedient: boolean = false;
  originExpedientExist: boolean = false;
  originExpedient: IExpedient = null;
  targetExpedient: IExpedient = null;
  loadingExpedient: boolean = false;
  integratedExpedients = new FormControl<string>({
    value: null,
    disabled: true,
  });

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
    private massiveExpedientService: MassiveExpedientService
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
          this.getGoodsByExpedient(expedientId, params)
            .pipe(
              tap(response => {
                this.originGoods = response.data;
                this.totalOrigin = response.count;
              })
            )
            .subscribe();
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
          this.getGoodsByExpedient(expedientId, params)
            .pipe(
              tap(response => {
                this.targetGoods = response.data;
                this.totalTarget = response.count;
              })
            )
            .subscribe();
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
          this.integratedExpedients.reset();
          return throwError(() => error);
        }),
        tap(expedient => {
          this.originExpedientExist = true;
          this.originExpedient = expedient;
          this.originForm.patchValue(expedient);
        }),
        mergeMap(expedient =>
          this.getIntegratedExpedients(expedient.id).pipe(map(() => expedient))
        ),
        tap(() => {
          const params = this.originParams.getValue();
          this.originParams.next(params);
        })
      )
      .subscribe();
  }

  getTargetExpedient(expedientId: string | number) {
    if (this.originExpedient.id == expedientId) {
      this.onLoadToast(
        'error',
        'Error',
        'El expediente de DESTINO debe ser distinto al expedient de ORIGEN'
      );
      this.targetControls.id.setValue(null);
      return;
    }
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

        tap(() => {
          const params = this.targetParams.getValue();
          this.targetParams.next(params);
        })
      )
      .subscribe();
  }

  getIntegratedExpedients(expedientId: string | number) {
    const params = new FilterParams();
    params.limit = 100;
    params.addFilter('proceedingsNumber', expedientId);
    return this.expedientService
      .getItegratedExpedients(params.getParams())
      .pipe(
        catchError(error => {
          this.integratedExpedients.reset();
          return throwError(() => error);
        }),
        tap(response => {
          const expedients = response.data;
          const value = expedients.map(
            expedient => expedient.proceedingsIntNumber
          );
          this.integratedExpedients.setValue(value.join(','));
        })
      );
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

  async save() {
    if (!this.originForm.valid || !this.targetForm.valid) {
      this.originForm.markAllAsTouched();
      this.targetForm.markAllAsTouched();
      return;
    }
    const isValid = this.validate();
    if (!isValid) {
      return;
    }
    const confirm = await this.alertQuestion(
      'warning',
      'Precaución',
      '¿Estás seguro que desea realizar la integración del expediente?'
    );
    if (confirm.isConfirmed) {
    }
    this.saveIntegration(this.originExpedient.id, this.targetExpedient.id);
  }

  saveIntegration(
    previousExpedient: string | number,
    newExpedient: string | number
  ) {
    this.loading = true;
    this.massiveExpedientService
      .depurateExpedient({ previousExpedient, newExpedient })
      .subscribe({
        next: response => {
          this.loading = false;
          this.resetForm(newExpedient);
        },
        error: error => {
          this.loading = false;
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrio un error al integrar el expediente'
          );
        },
      });
  }

  resetForm(newExpedient?: string | number) {
    if (newExpedient) {
      this.getOriginExpedient(newExpedient);
    }
    this.targetForm.reset();
    this.targetGoods = [];
    this.isIntegratingExpedient = false;
    this.originForm.enable();
  }

  updateExpedient() {
    const { transferNumber } = this.originExpedient;
    const expedient = { ...this.originForm.value, transferNumber };
    this.loadingExpedient = true;
    this.expedientService.update(this.originExpedient.id, expedient).subscribe({
      next: res => {
        this.loadingExpedient = false;
        this.originExpedient = {
          ...this.originExpedient,
          ...this.originForm.value,
        };
        this.onLoadToast('success', 'Expediente actualizado correctamente', '');
      },
      error: error => {
        this.loadingExpedient = false;
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al actualizar el expediente'
        );
      },
    });
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
        return false;
      }
    }
    return true;
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

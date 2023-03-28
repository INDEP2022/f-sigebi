import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IAccountMovement } from 'src/app/core/models/ms-account-movements/account-movement.model';
import { IGoodParameter } from 'src/app/core/models/ms-good-parameter/good-parameter.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { CategorizationAutomNumeraryService } from 'src/app/core/services/ms-good-parameters/categorization-autom-numerary.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { PartializeGoodService } from 'src/app/core/services/ms-partializate-good/partializate-good.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { HOME_DEFAULT } from 'src/app/utils/constants/main-routes';
import { truncateNDecimals } from 'src/app/utils/functions/truncate.function';
import {
  CATEGORIZATION_ERROR,
  DEFAULT_PLACEHOLDER,
  DISPERTION,
  GOOD_NOT_FOUND,
  GOOD_WITHOUT_ACT,
  IMPORT_PLACEHOLDER,
  LIMIT_REACHED,
  PARAMETER_NOT_FOUND,
  PARTIALIZATION_PARAMETER,
  PROCEEDING_STATUS,
  PROCEEDING_TYPES,
  QUANTITY_PLACEHOLDER,
  SAVE_GOOD_ERROR,
  STATUS_NOT_FOUND,
  UPDATE_GOOD_ERROR,
  WRONG_QUANTITY,
} from '../utils/goods-partialization-constants';
import { GoodPartializationForm } from '../utils/partialization-form';

@Component({
  selector: 'app-goods-partialization',
  templateUrl: './goods-partialization.component.html',
  styles: [],
})
export class GoodsPartializationComponent extends BasePage implements OnInit {
  // 4016287
  form = this.fb.group(new GoodPartializationForm());
  certificates: string[] | number[] = [];
  select = new DefaultSelect();
  private goodNum: number;
  private screen: string;
  initialValue: string = null;
  originalPlaceholder = DEFAULT_PLACEHOLDER;
  goodDescriptionCtrl = new FormControl<string>({
    disabled: true,
    value: null,
  });

  get controls() {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private goodParameterService: GoodParametersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private goodService: GoodService,
    private detailDeliveryReception: DetailProceeDelRecService,
    private proceedingsDeliveryRecService: ProceedingsDeliveryReceptionService,
    private screenStatusService: ScreenStatusService,
    private categorizationNumeraryService: CategorizationAutomNumeraryService,
    private accountMovementService: AccountMovementService,
    private partializeGoodService: PartializeGoodService
  ) {
    super();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.goodNum = params['good'];
        this.screen = params['screen'];
      });
  }

  ngOnInit(): void {
    this.getInitialParameter().subscribe(param => {
      this.initialValue = param.initialValue;
      this.validateParams(param);
    });
  }

  getInitialParameter() {
    this.hideError();
    return this.goodParameterService.getById(PARTIALIZATION_PARAMETER).pipe(
      catchError(error => {
        this.handleParameterError();
        return throwError(() => error);
      })
    );
  }

  resetForm() {
    this.form.reset();
    this.goodDescriptionCtrl.reset();
    this.controls.en.clearValidators();
    this.controls.y.clearValidators();
    this.controls.en.addValidators([
      Validators.required,
      Validators.min(1),
      Validators.pattern(NUMBERS_PATTERN),
    ]);
    this.controls.y.addValidators([
      Validators.required,
      Validators.min(1),
      Validators.pattern(NUMBERS_PATTERN),
    ]);
    this.controls.en.updateValueAndValidity();
    this.controls.y.updateValueAndValidity();
  }

  goodChange() {
    const goodId = this.controls.bien.value;
    if (!goodId) {
      this.resetForm();
      return;
    }
    this.validateGood(goodId).subscribe(good => {
      this.validatePartialization(good, this.initialValue);
    });
  }

  async handleParameterError() {
    await this.alert('error', 'Error', PARAMETER_NOT_FOUND);
    this.router.navigate([HOME_DEFAULT]);
  }

  validateParams(initialParameter: IGoodParameter) {
    const { initialValue } = initialParameter;
    if (this.goodNum) {
      this.validateGood(this.goodNum).subscribe(good => {
        if (this.screen) {
          const { status } = good;
          this.validateScreenStatus(status).subscribe(() =>
            this.validatePartialization(good, initialValue)
          );
        } else {
          this.validatePartialization(good, initialValue);
        }
      });
    }
  }

  validatePartialization(good: IGood, initialStatus: string) {
    const { goodClassNumber, appraisedValue, quantity } = good;

    if (this.goodClasifNeedsValidate(goodClassNumber, initialStatus)) {
      if (Number(appraisedValue) <= 1) {
        this.handleErrorGoHome(LIMIT_REACHED);
      }
      this.controls.isNume.setValue(true);
      this.controls.original.setValue(appraisedValue);
      this.controls.en.addValidators(Validators.max(appraisedValue - 1));
      this.controls.y.addValidators(Validators.max(appraisedValue - 1));
      this.originalPlaceholder = IMPORT_PLACEHOLDER;
    } else {
      if (Number(quantity) <= 1) {
        this.handleErrorGoHome(LIMIT_REACHED);
      }
      this.controls.isNume.setValue(false);
      this.controls.original.setValue(quantity);
      this.controls.en.addValidators(Validators.max(quantity - 1));
      this.controls.y.addValidators(Validators.max(quantity - 1));
      this.originalPlaceholder = QUANTITY_PLACEHOLDER;
    }
  }

  goodClasifNeedsValidate(clasifNum: string | number, initialStatus: string) {
    return clasifNum == initialStatus || clasifNum == 1424 || clasifNum == 1426;
  }

  validateGood(goodId: string | number) {
    return this.getGoodById(goodId).pipe(
      tap(good => {
        this.controls.bien.setValue(good.id);
        this.controls.originalQuantity.setValue(good.quantity);
        this.controls.originalImport.setValue(good.appraisedValue);
        this.goodDescriptionCtrl.setValue(good.description);
      }),
      switchMap(good => this.getDetailByGood(good.id).pipe(map(() => good)))
    );
  }

  getGoodById(goodId: string | number) {
    return this.goodService.getById(goodId).pipe(
      catchError(error => {
        this.onLoadToast('error', 'Error', GOOD_NOT_FOUND);
        this.controls.bien.reset();
        this.goodDescriptionCtrl.reset();
        return throwError(() => error);
      })
    );
  }

  getDetailByGood(goodId: string | number) {
    const params = new FilterParams();
    params.limit = 100;
    params.addFilter('numberGood', goodId);
    this.hideError();
    return this.getDetailDeliveryByGoodId(goodId).pipe(
      catchError(error => {
        this.handleErrorGoHome(GOOD_WITHOUT_ACT);
        return throwError(() => error);
      }),
      map(response => response.data.map(detail => detail.numberProceedings)),
      switchMap(proceedingsIds => this.getProceedingsByIds(proceedingsIds))
    );
  }

  getDetailDeliveryByGoodId(
    goodId: string | number,
    ids?: string[] | number[]
  ) {
    const params = new FilterParams();
    params.limit = 100;
    params.addFilter('numberGood', goodId);
    if (ids) {
      params.addFilter('numberProceedings', ids.join(','), SearchFilter.IN);
    }
    this.hideError();
    return this.detailDeliveryReception.getAllFiltered(params.getParams());
  }

  getProceedingsByIds(proceedingIds: number[]) {
    const params = new FilterParams();
    params.addFilter('id', proceedingIds.join(','), SearchFilter.IN);
    params.addFilter('statusProceedings', PROCEEDING_STATUS);
    params.addFilter('typeProceedings', PROCEEDING_TYPES, SearchFilter.IN);
    this.hideError();
    return this.proceedingsDeliveryRecService.getAll(params.getParams()).pipe(
      catchError(error => {
        this.handleErrorGoHome(GOOD_WITHOUT_ACT);
        return throwError(() => error);
      }),
      tap(response => {
        if (response.data.length == 0) {
          this.handleErrorGoHome(GOOD_WITHOUT_ACT);
        } else {
          this.certificates = response.data.map(detail => detail.id);
        }
      })
    );
  }

  validateScreenStatus(status: string) {
    const params = new FilterParams();
    params.addFilter('screenKey', this.screen);
    params.addFilter('status', status);
    this.hideError();
    return this.screenStatusService.getAllFiltered(params.getParams()).pipe(
      catchError(error => {
        this.handleErrorGoHome(STATUS_NOT_FOUND);
        return throwError(() => error);
      })
    );
  }

  handleErrorGoHome(error: string) {
    this.alertInfo('error', 'Error', error).then(() => {
      if (this.goodNum || this.screen) {
        this.router.navigate([HOME_DEFAULT]);
      } else {
        this.controls.bien.reset();
        this.goodDescriptionCtrl.reset();
      }
    });
  }

  inCtrlChange() {
    const value = this.controls.en.value;
    const originalValue = this.controls.original.value;
    if (!value) {
      return;
    }
    if (originalValue - value < 1) {
      this.onLoadToast('error', 'Error', WRONG_QUANTITY);
      return;
    }
    this.controls.y.setValue(originalValue - value);
  }

  andCtrlChange() {
    const value = this.controls.y.value;
    const originalValue = this.controls.original.value;
    if (!value) {
      return;
    }
    if (originalValue - value < 1) {
      this.onLoadToast('error', 'Error', WRONG_QUANTITY);
      return;
    }
    this.controls.en.setValue(originalValue - value);
  }

  async save() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const result = await this.alertQuestion(
      'warning',
      'Advertencia',
      '¿Seguro que desea parcializar el bien?'
    );
    if (result.isConfirmed) {
      this.partializaGood();
    }
  }

  partializaGood() {
    const { bien, en, y, isNume, originalQuantity, originalImport } =
      this.form.getRawValue();
    const body = {
      parGood: bien,
      tiValue1: en,
      tiValueOrigin: originalImport,
      diEsNumerary: isNume ? 'S' : 'N',
      diAmountOriginal: originalQuantity,
      tiValue2: y,
    };
    console.log(body, this.form.getRawValue());
    this.partializeGood(body).subscribe();
  }

  partializeGood(body: {}) {
    this.loading = true;
    return this.partializeGoodService.partializeGood(body).pipe(
      catchError(error => {
        this.loading = false;
        return throwError(() => error);
      }),
      tap(response => {
        this.loading = false;
        console.log(response);
        this.alert('success', 'Bien parcializado correctamente', '');
      })
    );
  }

  insertNewGood(good: IGood) {
    const { description, id } = good;
    let imp1: number, imp2: number, quantity1: number, quantity2: number;
    let desc: string = description;
    const { en, y, original, isNume, originalImport, originalQuantity } =
      this.controls;
    const percentage = Number(en.value) / Number(original.value);
    console.log(isNume.value);
    if (isNume.value) {
      imp1 = en.value;
      imp2 = y.value;
      quantity1 = 1;
      quantity2 = 1;
    } else {
      imp1 = truncateNDecimals(originalImport.value * percentage, 2);
      imp2 = originalImport.value - imp1;
      quantity1 = en.value;
      quantity2 = y.value;
    }
    if (description?.length < 600 - 14) {
      desc = `Parcializado de bien no: ${id}. ${description}`;
    }
    const goodToSave: IGood = {
      ...good,
      description: desc,
      quantity: quantity2,
      val2: `${imp2}`,
      appraisedValue: imp2,
      goodsPartializationFatherNumber: this.goodNum,
    };
    delete goodToSave.id;
    const updatedGood: IGood = {
      ...good,
      appraisedValue: imp1,
      quantity: quantity1,
      val2: `${imp1}`,
    };
    this.createPatializedGood(goodToSave)
      .pipe(
        switchMap(newGood =>
          this.updateGood(updatedGood).pipe(
            map(originalGood => {
              return { newGood, originalGood };
            })
          )
        ),
        tap(goods => {
          // const { newGood, originalGood } = goods;
          // forkJoin([
          //   this.disperseMovements(originalGood.id, percentage, newGood.id),
          // ]).subscribe();
          // forkJoin([
          //   this.disperseCertificates(originalGood.id, percentage, newGood.id),
          // ]).subscribe();
        })
      )
      .subscribe();
  }

  createPatializedGood(good: IGood) {
    this.loading = true;
    return this.goodService.create(good).pipe(
      catchError(error => {
        this.loading = false;
        this.alert('error', 'Error', SAVE_GOOD_ERROR);
        return throwError(() => error);
      }),
      tap(() => (this.loading = false))
    );
  }

  updateGood(good: IGood) {
    this.loading = true;
    return this.goodService.update(good).pipe(
      catchError(error => {
        this.alert('error', 'Error', UPDATE_GOOD_ERROR);
        return throwError(() => error);
      }),
      tap(() => (this.loading = false))
    );
  }

  disperseExpenses(goodId: number | string, percent: number) {
    console.log(this.certificates);
    return of();
  }

  disperseMovements(goodId: number | string, percent: number, newGood: number) {
    return this.getInitialCategories().pipe(
      switchMap(categories =>
        this.getAccountMovementsByCategories(categories, goodId)
      ),
      map(movements => {
        const obs: Observable<any>[] = [];
        movements.forEach(movement => {
          let movementToSave: IAccountMovement;
          let movementToUpdate: IAccountMovement;
          let imp1: number, imp11: number, imp2: number, imp22: number;
          const deposit = Number(movement.deposit);
          if (deposit != 0) {
            imp1 = truncateNDecimals(deposit * percent, 2);
            imp11 = deposit - imp1;
            imp2 = movement.postDiverse;
            imp22 = movement.postDiverse;
          } else {
            imp1 = movement.postDiverse;
            imp11 = movement.postDiverse;
            imp2 = truncateNDecimals(deposit * percent, 2);
            imp22 = movement.postDiverse - imp2;
          }
          movementToSave = {
            ...movement,
            deposit: `${imp11}`,
            postDiverse: imp22,
            numberGood: newGood,
            ispartialization: 'S',
          };
          delete movementToSave.numberMotion;
          movementToUpdate = {
            ...movement,
            deposit: `${imp1}`,
            postDiverse: imp2,
            ispartialization: 'S',
          };
          obs.push(this.createMovement(movementToSave));
          obs.push(this.updateMovement(movementToUpdate));
        });
        return obs;
      }),
      switchMap(obs => forkJoin(obs))
    );
  }

  getAccountMovementsByCategories(
    categories: string[],
    goodId: number | string
  ) {
    const params = new FilterParams();
    params.limit = 100;
    params.addFilter('numberGood', goodId);
    params.addFilter('category', categories.join(','), SearchFilter.IN);
    this.hideError();
    return this.accountMovementService
      .getAllFiltered(params.getParams())
      .pipe(map(response => response.data));
  }

  getInitialCategories() {
    const params = new FilterParams();
    params.limit = 100;
    params.addFilter('certificateType', DISPERTION);
    return this.categorizationNumeraryService
      .getAllFiltered(params.getParams())
      .pipe(
        catchError(error => {
          this.alert('error', 'Error', CATEGORIZATION_ERROR);
          return throwError(() => error);
        }),
        map(response => response.data.map(row => row.initialCategory))
      );
  }

  createMovement(movement: IAccountMovement) {
    return this.accountMovementService.update(movement).pipe(
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al guardar el movimiento de cuenta'
        );
        return throwError(() => error);
      })
    );
  }

  updateMovement(movement: IAccountMovement) {
    return this.accountMovementService.create(movement).pipe(
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al guardar el movimiento de cuenta'
        );
        return throwError(() => error);
      })
    );
  }

  disperseCertificates(
    goodId: number | string,
    percent: number,
    newGood: number
  ) {
    console.log('llego');
    return this.getDetailDeliveryByGoodId(goodId, this.certificates).pipe(
      map(response => {
        const obs: Observable<any>[] = [];
        response.data.forEach(certificate => {
          let quan1: number, quan2: number;
          let toSave: IDetailProceedingsDeliveryReception;
          let toUpdate: IDetailProceedingsDeliveryReception;
          const { isNume, en, y } = this.controls;
          if (isNume.value) {
            quan1 = 1;
            quan2 = 1;
          } else {
            quan1 = en.value;
            quan2 = y.value;
          }
          toSave = { ...certificate, numberGood: newGood };
        });
      })
    );
  }
}

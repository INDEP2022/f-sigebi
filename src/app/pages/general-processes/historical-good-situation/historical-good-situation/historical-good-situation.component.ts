import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { HistoricalGoodSituationForm } from '../utils/historical-good-situation-form';
import { HISTORICAL_GOOD_SITUATION_COLUMNS } from './historical-good-situation-columns';

@Component({
  selector: 'app-historical-good-situation',
  templateUrl: './historical-good-situation.component.html',
  styles: [
    `
      .title {
        font-size: 15px !important;
        font-weight: 500 !important;
        position: relative !important;
      }
      .btn-return {
        color: #9d2449;
        padding-left: 0px;
        left: -10px;
        position: relative;
        display: flex;
        align-items: center;
        top: -20px;
        margin-top: 5px;

        > i {
          font-size: 35px;
        }

        &:hover {
          color: #9d2449;
        }
      }
    `,
  ],
})
export class HistoricalGoodSituationComponent
  extends BasePage
  implements OnInit
{
  form = this.fb.group(new HistoricalGoodSituationForm());
  _params = {
    goodNumber: 0, // NO_BIEN
    origin: '',
  };
  global = {
    estHist: '', // EST_HIST
    fecCam: '', // FEC_CAM
  };
  goodId: number = null;
  params = new BehaviorSubject(new FilterParams());

  history: any[] = [];
  totalItems = 0;

  get controls() {
    return this.form.controls;
  }
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private historyGoodServie: HistoryGoodService,
    private goodService: GoodService
  ) {
    super();
    this.activatedRoute.queryParams
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => {
          this._params.goodNumber = params['noBien'] ?? null;
          this._params.origin = params['origin'] ?? null;
        })
      )
      .subscribe();
    this.settings.columns = HISTORICAL_GOOD_SITUATION_COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.controls.goodNumber.valueChanges
      .pipe(
        takeUntil(this.$unSubscribe),
        distinctUntilChanged(),
        debounceTime(500),
        tap(val => {
          this.goodId = val;
          if (!val) {
            this.form.reset();
            this.history = [];
            this.totalItems = 0;
            return;
          }
          this.getGood(this.goodId).subscribe();
        })
      )
      .subscribe();
    const { origin, goodNumber } = this._params;
    // if (origin == 'FACTREFACTAENTREC') {
    //   this.goodId = goodNumber;
    //   this.controls.goodNumber.setValue(goodNumber);
    // } else if (origin == 'FCONGENRASTREADOR') {
    this.goodId = goodNumber;
    this.controls.goodNumber.setValue(goodNumber);
    // }

    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => {
          if (this.goodId) {
            this.getHistory(params).subscribe();
          }
        })
      )
      .subscribe();
    this.global.estHist = null;
    this.global.fecCam = null;
  }

  getHistory(_params?: FilterParams) {
    const params = _params ?? new FilterParams();
    this.loading = true;
    console.log(this.goodId);
    return this.historyGoodServie
      .getHistoryGoodStatus(this.goodId, params.getParams())
      .pipe(
        catchError(error => {
          this.loading = false;
          this.totalItems = this.totalItems ?? 0;
          return throwError(() => error);
        }),
        tap(res => {
          this.loading = false;
          this.history = res.data;
          this.totalItems = res.count ?? 0;
        })
      );
  }

  getGood(goodNumber: number | string) {
    const params = new FilterParams();
    params.addFilter('id', goodNumber);
    return this.goodService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        this.form.reset();
        if (error.status < 500) {
          this.alert('error', 'Error', 'El bien no existe');
        } else {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrió un error al obtener el bien'
          );
        }
        return throwError(() => error);
      }),
      map(res => res.data[0]),
      tap(good => {
        this.form.patchValue(good);
        this.goodId = good.id;
        const params = new FilterParams();
        this.params.next(params);
      })
    );
  }
}

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
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
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { HistoricalGoodSituationForm } from '../utils/historical-good-situation-form';
import { HISTORICAL_GOOD_SITUATION_COLUMNS } from './historical-good-situation-columns';

@Component({
  selector: 'app-historical-good-situation',
  templateUrl: './historical-good-situation.component.html',
  styles: [],
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
  // params = new BehaviorSubject(new FilterParams());
  params = new BehaviorSubject<ListParams>(new ListParams());

  history: any[] = [];
  totalItems = 0;
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  get controls() {
    return this.form.controls;
  }
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private historyGoodServie: HistoryGoodService,
    private goodService: GoodService,
    private location: Location
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
    // this.settings.columns = HISTORICAL_GOOD_SITUATION_COLUMNS;
    // this.settings.actions = false;
    // this.settings.hideSubHeader = false;

    this.settings.columns = HISTORICAL_GOOD_SITUATION_COLUMNS;
    this.settings.actions = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
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
    this.goodId = goodNumber;

    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'descripcion':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'fec_cambio':
                if (filter.search) {
                  filter.search = `${this.returnParseDate(
                    filter.search
                  )} 00:00:00`;
                }
                console.log(filter.search);
                searchFilter = SearchFilter.SD;
                field = `filter.${filter.field}`;
                break;
              case 'usuario_cambio':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'motivo_cambio':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getHistory();
        }
      });
    this.controls.goodNumber.setValue(goodNumber);
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getHistory();
    });
    // this.params
    //   .pipe(
    //     takeUntil(this.$unSubscribe),
    //     tap(params => {
    //       if (this.goodId) {
    //         this.getHistory(params).subscribe();
    //       }
    //     })
    //   )
    //   .subscribe();
    this.global.estHist = null;
    this.global.fecCam = null;
  }

  goBack() {
    this.location.back();
  }

  getHistory(_params?: ListParams) {
    // const params = _params ?? new FilterParams();
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.historyGoodServie.getHistoryGoodStatus(this.goodId, params).subscribe({
      next: response => {
        this.data.load(response.data);
        this.data.refresh();
        console.log(this.data);
        this.loading = false;
        this.history = response.data;
        this.totalItems = response.count ?? 0;
      },
      error: err => {
        this.data.load([]);
        this.data.refresh();
        this.loading = false;
        this.totalItems = 0;
      },
    });
    // return this.historyGoodServie
    //   .getHistoryGoodStatus(this.goodId, params.getParams())
    //   .pipe(
    //     catchError(error => {
    //       this.loading = false;
    //       this.totalItems = this.totalItems ?? 0;
    //       return throwError(() => error);
    //     }),
    //     tap(res => {
    //       this.loading = false;
    //       this.history = res.data;
    //       this.totalItems = res.count ?? 0;
    //     })
    //   );
  }

  getGood(goodNumber: number | string) {
    const params = new FilterParams();
    params.addFilter('id', goodNumber);
    return this.goodService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        this.form.reset();
        if (error.status < 500) {
          this.onLoadToast('info', 'El Bien no Existe', '');
        } else {
          this.onLoadToast('info', 'El Bien no Existe', '');
        }
        return throwError(() => error);
      }),
      map(res => res.data[0]),
      tap(good => {
        this.form.patchValue(good);
        this.goodId = good.id;
        const params = new ListParams();
        this.params.next(params);
      })
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  skip,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IStatusXScreen } from 'src/app/core/models/ms-screen-status/status.model';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { SegAppScreenService } from 'src/app/core/services/ms-screen-status/seg-app-screen.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { VALID_STATUSES_COLUMNS } from './valid-statuses-columns';

@Component({
  selector: 'app-valid-statuses',
  templateUrl: './valid-statuses.component.html',
  styles: [],
})
export class ValidStatusesComponent extends BasePage implements OnInit {
  private global = {
    // ? FACTREFACTAENTREC usar este parametro como ejemplo
    screenStatus: '',
  };
  screenCtrl = new FormControl<string>({ value: null, disabled: true });
  helpCtrol = new FormControl<string>(null);
  params = new BehaviorSubject(new FilterParams());

  statuses: IStatusXScreen[] = [];
  totalItems = 0;
  constructor(
    private segAppScreenService: SegAppScreenService,
    private activatedRoute: ActivatedRoute,
    private screenStatusService: ScreenStatusService
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = VALID_STATUSES_COLUMNS;
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.global.screenStatus = params['screen'];
      });
  }

  ngOnInit(): void {
    this.params
      .pipe(
        skip(1),
        switchMap(params => this.getScreenStatuses(params))
      )
      .subscribe();
    this.fillFromParams();
  }

  fillFromParams() {
    const { screenStatus } = this.global;
    if (screenStatus) {
      this.getScreenStatusById(screenStatus).subscribe();
      const params = this.params.getValue();
      params.removeAllFilters();
      params.addFilter('cveScreen', screenStatus);
      this.params.next(params);
    }
  }

  getScreenStatusById(id: string) {
    this.hideError();
    return this.segAppScreenService.getById(id).pipe(
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener el status'
        );
        return throwError(() => error);
      }),
      tap(screenStatus => {
        this.screenCtrl.setValue(screenStatus.description);
      })
    );
  }

  getScreenStatuses(params: FilterParams) {
    this.hideError();
    this.loading = true;
    return this.screenStatusService.getAllFiltered(params.getParams()).pipe(
      catchError(error => {
        this.loading = false;
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener los estatus'
        );
        return throwError(() => error);
      }),
      tap(response => {
        this.loading = false;
        this.statuses = response.data;
        this.totalItems = response.count;
      })
    );
  }
}

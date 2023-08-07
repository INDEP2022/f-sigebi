import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  skip,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IScreenHelpTwo } from 'src/app/core/models/ms-business-rule/screen-help.model';
import { IStatusXScreen } from 'src/app/core/models/ms-screen-status/status.model';
import { ScreenHelpService } from 'src/app/core/services/ms-business-rule/screen-help.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { SegAppScreenService } from 'src/app/core/services/ms-screen-status/seg-app-screen.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { HELP_COLUMNS, VALID_STATUSES_COLUMNS } from './valid-statuses-columns';

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
  helpForm: FormGroup;
  helpText = 'No hay ayuda para esta pantalla';
  screenCtrl = new FormControl<string>({ value: null, disabled: true });
  helpCtrol = new FormControl<string>(null);
  params = new BehaviorSubject(new FilterParams());
  showStatus: boolean = true;
  screenStatus: string = '';
  help: IScreenHelpTwo[];
  loading2: boolean = false;
  statuses: IStatusXScreen[] = [];
  totalItems = 0;
  params2 = new BehaviorSubject(new ListParams());
  totalItems2 = 0;

  constructor(
    private fb: FormBuilder,
    private segAppScreenService: SegAppScreenService,
    private activatedRoute: ActivatedRoute,
    private screenStatusService: ScreenStatusService,
    private screenHelpService: ScreenHelpService
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = VALID_STATUSES_COLUMNS;
    this.settings.hideSubHeader = false;
    settings2 = { ...TABLE_SETTINGS };
    this.settings2.actions = false;
    this.settings2.columns = HELP_COLUMNS;
    this.settings2.hideSubHeader = false;
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.global.screenStatus = params['screen'];
      });
  }

  ngOnInit(): void {
    this.prepareHelpForm();
    this.params.pipe(skip(1)).subscribe(params => {
      this.getScreenStatuses(params).subscribe();
      this.getHelpByScreen(this.global.screenStatus).subscribe();
    });
    this.fillFromParams();
  }

  fillFromParams() {
    const { screenStatus } = this.global;
    if (screenStatus) {
      this.getScreenStatusById(screenStatus).subscribe();
      const params = this.params.getValue();
      params.removeAllFilters();
      this.screenStatus = screenStatus;
      params.addFilter('screenKey', screenStatus);
      this.params.next(params);
    }
  }
  prepareHelpForm() {
    this.helpForm = this.fb.group({
      screenKey: [
        null,
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(11)],
      ],
    });
  }

  getScreenStatusById(id: string) {
    this.hideError();
    return this.segAppScreenService.getById(id).pipe(
      catchError(error => {
        this.loading = false;
        if (error.status >= 500) {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrio un error al obtener el status'
          );
        }

        return throwError(() => error);
      }),
      tap(screenStatus => {
        this.loading = false;
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
        if (error.status >= 500) {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrio un error al obtener los estatus'
          );
        }

        return throwError(() => error);
      }),
      tap(response => {
        console.log(response);
        this.getHelpByScreen(this.screenStatus);
        this.loading = false;
        this.statuses = response.data;
        this.totalItems = response.count;
        this.showStatus = this.statuses.length > 0;
      })
    );
  }

  getHelpByScreen(screen: string) {
    return this.screenHelpService
      .getHelpScreen(screen)
      .pipe(tap(screenHelp => (this.help = screenHelp.data)));
  }
}

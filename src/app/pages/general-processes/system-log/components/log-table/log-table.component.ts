import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, catchError, takeUntil, tap, throwError } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IBinnacle } from 'src/app/core/models/ms-audit/binnacle.model';
import { SeraLogService } from 'src/app/core/services/ms-audit/sera-log.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { LOG_TABLE_COLUMNS } from '../../utils/log-table-columns';

@Component({
  selector: 'system-log-table',
  templateUrl: './log-table.component.html',
  styles: [],
})
export class LogTableComponent extends BasePage implements OnInit, OnChanges {
  @Input() registerNum: number = null;
  params = new BehaviorSubject(new FilterParams());
  binnacles: IBinnacle[] = [];
  totalItems = 0;
  constructor(private seraLogService: SeraLogService) {
    super();
    this.settings = {
      ...this.settings,
      columns: LOG_TABLE_COLUMNS,
      actions: false,
    };
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      console.log(this.registerNum);
      if (this.registerNum) {
        this.getBinnacleData(params).subscribe();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['registerNum']) {
      console.log(this.registerNum);
      if (this.registerNum != null) {
        const params = new FilterParams();
        this.params.next(params);
      } else {
        this.binnacles = [];
        this.totalItems = 0;
      }
    }
  }

  getBinnacleData(params: FilterParams) {
    this.hideError();
    this.loading = true;
    return this.seraLogService
      .getAllByRegisterNum(this.registerNum, params.getParams())
      .pipe(
        catchError(error => {
          this.loading = false;
          if (error.status >= 500) {
            this.onLoadToast(
              'error',
              'Error',
              'Ocurrio un error al obtener los registros de la bitacora'
            );
          }
          return throwError(() => error);
        }),
        tap(response => {
          this.loading = false;
          this.binnacles = response.data;
          this.totalItems = response.count;
        })
      );
  }
}

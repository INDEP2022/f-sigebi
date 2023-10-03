import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { AppraisalRegistrationChild } from '../../classes/appraisal-registration-child';
import { APPRAISAL_TABLE_COLUMNS } from '../../utils/columns/appraisal-table-columns';

@Component({
  selector: 'app-appraisal-list',
  templateUrl: './appraisal-list.component.html',
  styles: [],
})
export class AppraisalListComponent
  extends AppraisalRegistrationChild
  implements OnInit
{
  params = new BehaviorSubject(new FilterParams());
  appraisals = new LocalDataSource();
  totalItems = 0;

  get controls() {
    return this.comerEventForm.controls;
  }
  constructor(private parameterModService: ParameterModService) {
    super();
    this.settings = {
      ...this.settings,
      columns: {
        ...APPRAISAL_TABLE_COLUMNS,
      },
      hideSubHeader: false,
      actions: false,
    };
  }

  ngOnInit(): void {
    this.onComerEventChange().subscribe();
    this.columnsFilter().subscribe();
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => {
          const { id_evento } = this.controls;
          if (!id_evento.value) {
            return;
          }
          this.getGoods(params).subscribe();
        })
      )
      .subscribe();
  }

  columnsFilter() {
    return this.appraisals.onChanged().pipe(
      distinctUntilChanged(),
      debounceTime(500),
      takeUntil(this.$unSubscribe),
      tap(dataSource => this.buildColumnFilter(dataSource))
    );
  }

  buildColumnFilter(dataSource: any) {
    const params = new FilterParams();
    if (dataSource.action == 'filter') {
      const filters = dataSource.filter.filters;
      filters.forEach((filter: any) => {
        const columns = this.settings.columns as any;
        const operator = columns[filter.field]?.operator;
        if (!filter.search) {
          return;
        }
        params.addFilter(
          filter.field,
          filter.search,
          operator || SearchFilter.EQ
        );
      });
      this.params.next(params);
    }
  }

  getGoods(params: FilterParams) {
    this.loading = true;
    const { id_evento, item_tipo_proceso } = this.controls;
    const eventId = id_evento.value;
    const direction = this.global.direction;
    return this.parameterModService
      .getComerEventAppraisal({ eventId, direction }, params.getParams())
      .pipe(
        catchError(error => {
          this.loading = false;
          this.appraisals.load([]);
          this.appraisals.refresh();
          this.totalItems = 0;
          return throwError(() => error);
        }),
        tap(response => {
          this.loading = false;
          console.log(response.data);
          this.appraisals.load(response.data);
          this.appraisals.refresh();
          this.totalItems = response.count;
        })
      );
  }

  resetTable() {
    this.appraisals.load([]);
    this.appraisals.refresh();
    this.totalItems = 0;
    const params = new FilterParams();
    this.params.next(params);
  }

  onComerEventChange() {
    return this.searchGoods.pipe(
      takeUntil(this.$unSubscribe),
      tap(comerEventId => {
        if (!comerEventId) {
          this.resetTable();
          return;
        }
        const params = new FilterParams();
        this.params.next(params);
      })
    );
  }

  onUserSelectAppraisal(event: any) {
    if (event.isSelected) {
      this.$selectedAppraisal.next(event.data);
    } else {
      this.$selectedAppraisal.next(null);
    }
  }
}

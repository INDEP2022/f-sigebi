import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared';
import { IEventPreparationParameters } from '../../../utils/interfaces/event-preparation-parameters';
import { CONSIGMENTS_EVENTS_COLUMNS } from '../../utils/consigments-events-columns';

@Component({
  selector: 'consigments-events',
  templateUrl: './consigments-events.component.html',
  styles: [],
})
export class ConsigmentsEventsComponent extends BasePage implements OnInit {
  params = new BehaviorSubject(new FilterParams());
  events = new LocalDataSource();
  totalItems = 0;
  @Input() parameters: IEventPreparationParameters;
  @Input() preparation: boolean;
  @Input() eventSelected: IComerEvent;
  @Output() eventSelectedChange = new EventEmitter<IComerEvent>();
  @Output() exit = new EventEmitter<void>();
  constructor(private comerEventService: ComerEventService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: CONSIGMENTS_EVENTS_COLUMNS,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.columnsFilter().subscribe();
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => this.getEvents(params).subscribe())
      )
      .subscribe();
  }

  columnsFilter() {
    return this.events.onChanged().pipe(
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
  getEvents(params: FilterParams) {
    this.loading = true;
    params.addFilter('address', this.parameters.pDirection);
    params.addFilter('eventTpId', this.preparation ? 10 : 6);
    return this.comerEventService.getEatEvents(params.getParams()).pipe(
      catchError(error => {
        this.loading = false;
        this.events.load([]);
        this.events.refresh();
        this.totalItems = 0;
        return throwError(() => error);
      }),
      tap(response => {
        this.loading = false;
        console.log(response.data);

        this.events.load(response.data);
        this.events.refresh();
        this.totalItems = response.count;
      })
    );
  }

  selectEvent(event: any) {
    if (event.isSelected) {
      this.eventSelectedChange.emit(event.data);
    } else {
      this.eventSelectedChange.emit(null);
    }
  }
}

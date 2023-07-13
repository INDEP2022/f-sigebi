import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
import { ComerEventForm } from '../../utils/forms/comer-event-form';
import { PREPARE_EVENT_EVENTS_LIST_COLUMNS } from '../../utils/table-columns/events-list-columns';

@Component({
  selector: 'commer-events-list',
  templateUrl: './commer-events-list.component.html',
  styles: [],
})
export class CommerEventsListComponent extends BasePage implements OnInit {
  params = new BehaviorSubject(new FilterParams());
  totalItems = 0;
  events = new LocalDataSource();

  @Input() globalEvent: IComerEvent = null;
  @Output() globalEventChange = new EventEmitter<IComerEvent>();
  @Input() eventForm: FormGroup<ComerEventForm>;
  constructor(private comerEventService: ComerEventService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: PREPARE_EVENT_EVENTS_LIST_COLUMNS,
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
    return this.comerEventService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        this.loading = false;
        this.events.load([]);
        this.events.refresh();
        this.totalItems = 0;
        return throwError(() => error);
      }),
      tap(response => {
        this.loading = false;
        this.events.load(response.data);
        this.events.refresh();
        this.totalItems = response.count;
      })
    );
  }

  selectEvent(event: any) {
    if (event.isSelected) {
      this.globalEventChange.emit(event.data);
      this.eventForm.patchValue({
        ...event.data,
        eventDate: event.data?.eventDate
          ? new Date(event.data?.eventDate)
          : null,
        closeDate: event.data?.closeDate
          ? new Date(event.data?.closeDate)
          : null,
        failureDate: event.data?.failureDate
          ? new Date(event.data?.failureDate)
          : null,
      });
    } else {
      this.globalEventChange.emit(null);
      this.eventForm.reset();
    }
  }

  openEvent() {
    if (!this.globalEvent) {
      this.alert('error', 'Error', 'Primero debe seleccionar un evento');
    }
  }
}

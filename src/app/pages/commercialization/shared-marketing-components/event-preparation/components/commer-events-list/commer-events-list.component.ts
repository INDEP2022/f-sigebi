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
import { UNEXPECTED_ERROR } from 'src/app/utils/constants/common-errors';
import { ComerEventForm } from '../../utils/forms/comer-event-form';
import { IEventPreparationParameters } from '../../utils/interfaces/event-preparation-parameters';
import { PREPARE_EVENT_EVENTS_LIST_COLUMNS } from '../../utils/table-columns/events-list-columns';

@Component({
  selector: 'commer-events-list',
  templateUrl: './commer-events-list.component.html',
  styles: [],
})
export class CommerEventsListComponent extends BasePage implements OnInit {
  @Input() params = new BehaviorSubject(new FilterParams());
  @Input() events = new LocalDataSource();
  @Input() globalEvent: IComerEvent = null;
  @Output() globalEventChange = new EventEmitter<IComerEvent>();
  @Input() eventForm: FormGroup<ComerEventForm>;
  @Output() onOpenEvent = new EventEmitter<void>();
  @Input() parameters: IEventPreparationParameters;
  eventSelected: IComerEvent = null;
  get controls() {
    return this.eventForm.controls;
  }
  totalItems = 0;
  constructor(private comerEventService: ComerEventService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        delete: true,
        add: false,
        edit: false,
        columnTitle: 'Acciones',
        position: 'right',
      },
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

  resetEventSelected() {
    this.eventForm.reset();
    this.settings.selectedRowIndex = -1;
  }

  getEvents(params: FilterParams) {
    this.resetEventSelected();
    this.loading = true;
    params.addFilter('address', this.parameters.pDirection);
    // params.sortBy = 'id:DESC';
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
      this.globalEventChange.emit(event.data);
      this.eventSelected = event.data;
    } else {
      this.globalEventChange.emit(null);
      this.eventSelected = null;
      this.eventForm.reset();
    }
  }

  openEvent() {
    if (!this.eventSelected) {
      this.alert('error', 'Error', 'Selecciona un Evento');
      return;
    }

    this.eventForm.patchValue(
      {
        ...this.eventSelected,
        eventDate: this.eventSelected?.eventDate
          ? new Date(this.eventSelected?.eventDate)
          : null,
        eventClosingDate: this.eventSelected?.eventClosingDate
          ? new Date(this.eventSelected?.eventClosingDate)
          : null,
        failureDate: this.eventSelected?.failureDate
          ? new Date(this.eventSelected?.failureDate)
          : null,
      }
      // { emitEvent: false }
    );
    console.warn('SETEO DEL FORMULARIO');
    console.log(this.eventSelected);

    console.log(this.eventForm.value);

    this.onOpenEvent.emit();
  }

  async onDeleteEvent(event: IComerEvent) {
    const confirm = await this.alertQuestion(
      'question',
      'Eliminar',
      '¿Desea eliminar este registro?'
    );
    const { isConfirmed } = confirm;
    if (!isConfirmed) {
      return;
    }
    this.deleteEvent(event.id).subscribe();
  }

  deleteEvent(eventId: string | number) {
    this.loading = true;
    return this.comerEventService.removeEvent(eventId).pipe(
      catchError(error => {
        this.loading = false;
        if (error.error.message.includes('violates foreign key constraint')) {
          this.alert(
            'error',
            'Error',
            'Hay información relacionada a este registro, no se puede eliminar'
          );
        } else {
          this.alert('error', 'Error', UNEXPECTED_ERROR);
        }
        return throwError(() => error);
      }),
      tap(() => {
        this.loading = false;
        this.alert('success', 'El Evento ha sido Eliminado', '');
        this.refreshTable();
      })
    );
  }

  refreshTable() {
    const params = new FilterParams();
    this.params.next(params);
  }
}

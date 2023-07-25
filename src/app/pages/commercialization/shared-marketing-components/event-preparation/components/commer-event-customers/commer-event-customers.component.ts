import { Component, Input, OnInit } from '@angular/core';
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
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { BasePage } from 'src/app/core/shared';
import { ComerEventForm } from '../../utils/forms/comer-event-form';
import { PREPARE_EVENT_CUSTOMER_LIST_COLUMNS } from '../../utils/table-columns/event-customer-list-columns';

@Component({
  selector: 'commer-event-customers',
  templateUrl: './commer-event-customers.component.html',
  styles: [],
})
export class CommerEventCustomersComponent extends BasePage implements OnInit {
  @Input() params = new BehaviorSubject(new FilterParams());
  @Input() eventForm: FormGroup<ComerEventForm>;
  totalItems = 0;
  customers = new LocalDataSource();
  get controls() {
    return this.eventForm.controls;
  }
  constructor(private comerClientService: ComerClientsService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: PREPARE_EVENT_CUSTOMER_LIST_COLUMNS,
      hideSubHeader: false,
    };
  }
  ngOnInit() {
    const { id } = this.controls;
    this.columnsFilter().subscribe();
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => {
          if (id.value) {
            this.getCustomers(params).subscribe();
          }
        })
      )
      .subscribe();
  }

  columnsFilter() {
    return this.customers.onChanged().pipe(
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

  getCustomers(params: FilterParams) {
    this.loading = true;
    return this.comerClientService.getAllWithFilters(params.getParams()).pipe(
      catchError(error => {
        this.loading = false;
        this.customers.load([]);
        this.customers.refresh();
        this.totalItems = 0;
        return throwError(() => error);
      }),
      tap(response => {
        this.loading = false;
        console.log(response.data);

        this.customers.load(response.data);
        this.customers.refresh();
        this.totalItems = response.count;
      })
    );
  }
}

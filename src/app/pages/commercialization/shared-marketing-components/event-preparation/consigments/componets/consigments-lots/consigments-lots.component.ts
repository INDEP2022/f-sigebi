import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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
import { IComerLot } from 'src/app/core/models/ms-prepareevent/comer-lot.model';
import { ComerLotService } from 'src/app/core/services/ms-prepareevent/comer-lot.service';
import { BasePage } from 'src/app/core/shared';
import { CONSIGMENTS_LOTS_COLUMNS } from '../../utils/consigments-lots-columns';

@Component({
  selector: 'consigments-lots',
  templateUrl: './consigments-lots.component.html',
  styles: [],
})
export class ConsigmentsLotsComponent
  extends BasePage
  implements OnInit, OnChanges
{
  params = new BehaviorSubject(new FilterParams());
  totalItems = 0;
  lots = new LocalDataSource();
  @Input() eventSelected: IComerEvent;
  @Input() lotSelected: IComerLot = null;
  @Output() lotSelectedChange = new EventEmitter<IComerLot>();
  constructor(private comerLotService: ComerLotService) {
    super();
    this.settings = {
      ...this.settings,
      columns: CONSIGMENTS_LOTS_COLUMNS,
      hideSubHeader: false,
      actions: false,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['eventSelected']) {
      const params = new FilterParams();
      this.params.next(params);
      this.lotSelectedChange.emit(null);
    }
  }

  ngOnInit(): void {
    this.columnsFilter().subscribe();
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => {
          if (this.eventSelected) {
            this.getLots(params).subscribe();
          } else {
            this.lots.load([]);
            this.totalItems = 0;
          }
        })
      )
      .subscribe();
  }

  columnsFilter() {
    return this.lots.onChanged().pipe(
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

  getLots(params: FilterParams) {
    this.loading = true;
    params.addFilter('eventId', this.eventSelected.id);
    // params.sortBy = 'publicLot:ASC';
    return this.comerLotService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        this.loading = false;
        this.lots.load([]);
        this.lots.refresh();
        this.totalItems = 0;
        return throwError(() => error);
      }),
      tap(response => {
        this.loading = false;
        console.log(response.data);

        this.lots.load(response.data);
        this.lots.refresh();
        this.totalItems = response.count;
      })
    );
  }

  selectLot(event: any) {
    if (event.isSelected) {
      this.lotSelectedChange.emit(event.data);
    } else {
      this.lotSelectedChange.emit(null);
    }
  }
}

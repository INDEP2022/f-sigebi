import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
import { IComerLot } from 'src/app/core/models/ms-prepareevent/comer-lot.model';
import { ComerGoodsXLotService } from 'src/app/core/services/ms-comersale/comer-goods-x-lot.service';
import { BasePage } from 'src/app/core/shared';
import { ComerEventForm } from '../../utils/forms/comer-event-form';
import { IEventPreparationParameters } from '../../utils/interfaces/event-preparation-parameters';
import { EVENT_LOT_GOODS_LIST_COLUMNS } from '../../utils/table-columns/event-lot-goods-list-columns';

@Component({
  selector: 'event-goods-lots-list',
  templateUrl: './event-goods-lots-list.component.html',
  styles: [],
})
export class EventGoodsLotsListComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() eventForm: FormGroup<ComerEventForm>;
  @Input() parameters: IEventPreparationParameters;
  @Input() params = new BehaviorSubject(new FilterParams());
  @Input() lot: IComerLot;
  totalItems = 0;
  lotGoods = new LocalDataSource();
  get controls() {
    return this.eventForm.controls;
  }
  constructor(private comerGoodsXLotService: ComerGoodsXLotService) {
    super();
    this.settings = {
      ...this.settings,
      columns: EVENT_LOT_GOODS_LIST_COLUMNS,
      hideSubHeader: false,
      actions: false,
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lot']) {
      const params = new FilterParams();
      this.params.next(params);
    }
  }

  ngOnInit(): void {
    this.columnsFilter().subscribe();
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => {
          if (!this.lot) {
            this.lotGoods.load([]);
            this.lotGoods.refresh();
            this.totalItems = 0;
            return;
          }
          this.getLotGoods(params).subscribe();
        })
      )
      .subscribe();
  }

  columnsFilter() {
    return this.lotGoods.onChanged().pipe(
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

  getLotGoods(params: FilterParams) {
    this.loading = true;
    params.addFilter('idLot', this.lot.id);
    params.sortBy = 'goodNumber:ASC';
    return this.comerGoodsXLotService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        this.loading = false;
        this.lotGoods.load([]);
        this.lotGoods.refresh();
        this.totalItems = 0;
        return throwError(() => error);
      }),
      tap(response => {
        this.loading = false;
        console.log(response.data);

        this.lotGoods.load(response.data);
        this.lotGoods.refresh();
        this.totalItems = response.count;
      })
    );
  }
}

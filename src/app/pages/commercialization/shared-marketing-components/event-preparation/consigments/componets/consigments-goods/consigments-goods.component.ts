import {
  Component,
  EventEmitter,
  Input,
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
import { ComerGoodsXLotService } from 'src/app/core/services/ms-comersale/comer-goods-x-lot.service';
import { BasePage } from 'src/app/core/shared';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { CONSIGMENTS_GOODS_COLUMNS } from '../../utils/consigments-goods-columns';

@Component({
  selector: 'consigments-goods',
  templateUrl: './consigments-goods.component.html',
  styles: [],
})
export class ConsigmentsGoodsComponent extends BasePage implements OnInit {
  @Input() lotSelected: IComerLot = null;
  @Input() params = new BehaviorSubject(new FilterParams());
  @Output() onAccept = new EventEmitter<any[]>();
  @Input() preparation: boolean;
  @Input() eventSelected: IComerEvent;

  totalItems = 0;
  lotGoods = new LocalDataSource();
  selectedGoods: any[] = [];
  constructor(private comerGoodsXLotService: ComerGoodsXLotService) {
    super();
    this.settings = {
      ...this.settings,
      columns: {
        ...CONSIGMENTS_GOODS_COLUMNS,
        selection_good: {
          title: 'Seleccionar',
          sort: false,
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          showAlways: true,
          valuePrepareFunction: (isSelected: boolean, row: any) =>
            this.isGoodSelected(row),
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onGoodSelect(instance),
        },
      },
      actions: false,
    };
  }

  onGoodSelect(instance: CheckboxElementComponent) {
    instance.toggle
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(({ row, toggle }) => this.onGoodChange(row, toggle))
      )
      .subscribe();
  }

  onGoodChange(good: any, selected: boolean) {
    if (!selected) {
      this.selectedGoods = this.selectedGoods.filter(
        _good => _good.idGoodInLot != good.idGoodInLot
      );
      return;
    }
    // if (good.status != 'VXR' || !good.status) {
    //   this.alert('error', 'Error', 'Este estatus no se puede incorporar');
    //   this.settings = { ...this.settings };
    //   return;
    // }
    if (good.commercialEventId) {
      this.alert(
        'error',
        'Error',
        'El bien ya esta en un evento y no puede seleccionarse'
      );
      this.settings = { ...this.settings };
      return;
    }
    const validStatuses = this.preparation ? ['CPV'] : ['PRE', 'CXR'];
    if (!validStatuses.includes(good?.bienes?.status)) {
      this.alert(
        'error',
        'Error',
        'El estatus de bien no es válido para comercializar'
      );
      this.settings = { ...this.settings };
      return;
    }
    this.selectedGoods.push(good);
  }

  isGoodSelected(_good: any) {
    const exists = this.selectedGoods.find(
      good => good.idGoodInLot == _good.idGoodInLot
    );
    return exists ? true : false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lotSelected']) {
      const params = new FilterParams();
      this.params.next(params);
      this.selectedGoods = [];
    }
  }

  ngOnInit(): void {
    this.columnsFilter().subscribe();
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => {
          if (!this.lotSelected) {
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
    params.addFilter('idLot', this.lotSelected.id);
    params.sortBy = 'goodNumber:ASC';
    return this.comerGoodsXLotService
      .getAllFilterPostQuery(params.getParams())
      .pipe(
        catchError(error => {
          this.loading = false;
          this.lotGoods.load([]);
          this.lotGoods.refresh();
          this.totalItems = 0;
          return throwError(() => error);
        }),
        tap(response => {
          this.loading = false;
          const d = response.data.map(e => {
            return {
              ...e,
              _lot: this.lotSelected?.id,
              _event: this.eventSelected?.id,
            };
          });
          this.lotGoods.load(response.data);
          this.lotGoods.refresh();
          this.totalItems = response.count;
        })
      );
  }

  _onAccept() {
    if (!this.selectedGoods.length) {
      this.alert('error', 'Error', 'Debe seleccionar al menos un Bien');
      return;
    }
    this.onAccept.emit(this.selectedGoods);
  }
}

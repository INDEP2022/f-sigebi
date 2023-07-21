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
import { IComerGoodRejected } from 'src/app/core/models/ms-prepareevent/comer-good-rejected.mode';
import { ComerGoodsRejectedService } from 'src/app/core/services/ms-prepareevent/comer-goods-rejected.service';
import { BasePage } from 'src/app/core/shared';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { ComerEventForm } from '../../utils/forms/comer-event-form';
import { COMER_REJECTED_GOODS_COLUMNS } from '../../utils/table-columns/comer-rejected-goods-list-columns';

@Component({
  selector: 'rejected-goods-list',
  templateUrl: './rejected-goods-list.component.html',
  styles: [],
})
export class RejectedGoodsListComponent extends BasePage implements OnInit {
  @Input() viewRejectedGoods: boolean;
  @Input() eventForm: FormGroup<ComerEventForm>;
  @Output() viewRejectedGoodsChange = new EventEmitter<boolean>();
  params = new BehaviorSubject(new FilterParams());
  rejectedGoods = new LocalDataSource();
  totalItems = 0;
  vxrGoods: IComerGoodRejected[] = [];
  saleGoods: IComerGoodRejected[] = [];

  get controls() {
    return this.eventForm.controls;
  }
  constructor(private comerGoodsRejectedService: ComerGoodsRejectedService) {
    super();
    this.settings = {
      ...this.settings,
      columns: {
        ...COMER_REJECTED_GOODS_COLUMNS,
        vxr: {
          title: 'Inc. VXR',
          sort: false,
          type: 'custom',
          filter: false,
          renderComponent: CheckboxElementComponent,
          showAlways: true,
          valuePrepareFunction: (
            isSelected: boolean,
            row: IComerGoodRejected
          ) => this.isAVXRGood(row),
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onVXRChange(instance),
        },
        sale: {
          title: 'Venta',
          sort: false,
          type: 'custom',
          filter: false,
          renderComponent: CheckboxElementComponent,
          showAlways: true,
        },
      },
      actions: false,
      hideSubHeader: false,
    };
  }

  isAVXRGood(_good: IComerGoodRejected) {
    const exists = this.vxrGoods.find(
      good => good.propertyNumber == _good.propertyNumber
    );
    return exists ? true : false;
  }

  onVXRChange(instance: CheckboxElementComponent) {
    instance.toggle
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(({ row, toggle }) => this.VXRChange(row, toggle))
      )
      .subscribe();
  }

  VXRChange(good: IComerGoodRejected, selected: boolean) {
    if (!selected) {
      this.vxrGoods = this.vxrGoods.filter(
        _good => _good.propertyNumber != good.propertyNumber
      );
    }
    if (good.status != 'VXR' || !good.status) {
      this.alert('error', 'Error', 'Este estatus no se puede incorporar');
      this.settings = { ...this.settings };
      return;
    }
    this.vxrGoods.push(good);
  }

  ngOnInit(): void {
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => this.getRejectedGoods(params).subscribe())
      )
      .subscribe();
    this.columnsFilter().subscribe();
  }

  columnsFilter() {
    return this.rejectedGoods.onChanged().pipe(
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

  getRejectedGoods(params: FilterParams) {
    const { id } = this.controls;
    params.addFilter('eventId', id.value);
    this.loading = true;
    return this.comerGoodsRejectedService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        this.loading = false;
        this.rejectedGoods.load([]);
        this.rejectedGoods.refresh();
        this.totalItems = 0;
        return throwError(() => error);
      }),
      tap(response => {
        this.loading = false;
        this.rejectedGoods.load(response.data);
        this.rejectedGoods.refresh();
        this.totalItems = response.count;
      })
    );
  }

  goBack() {
    this.vxrGoods = [];
    this.saleGoods = [];
    this.viewRejectedGoodsChange.emit(false);
  }

  onIncorporate() {
    this.incorporate();
  }

  incorporate() {
    // TODO: IMPLEMENTAR CUANDO SE TENGA
    console.log('COMER_BIENESRECHAZADOS=INCVXR=WHEN-BUTTON-PRESSED.txt');
  }

  onSale() {
    this.changeToSale();
  }

  changeToSale() {
    // TODO: IMPLEMENTAR CUANDO SE TENGA
    console.log('COMER_BIENESRECHAZADOS=NO_ETQ_3=WHEN-BUTTON-PRESSED.txt');
  }

  onExportExcel() {
    this.exportExcel();
  }

  /**EXPORTA_RECHAZADOS */
  exportExcel() {
    console.log('EXPORTA_RECHAZADOS');
  }
}

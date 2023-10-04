import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { FullService } from 'src/app/layouts/full/full.service';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { UNEXPECTED_ERROR } from 'src/app/utils/constants/common-errors';
import { AppraisalRegistrationChild } from '../../classes/appraisal-registration-child';
import { APPRAISAL_GOODS_TABLE_COLUMNS } from '../../utils/columns/appraisal-goods-table-columns';

@Component({
  selector: 'appraisal-goods-table',
  templateUrl: './appraisal-goods-table.component.html',
  styles: [],
})
export class AppraisalGoodsTableComponent
  extends AppraisalRegistrationChild
  implements OnInit
{
  params = new BehaviorSubject(new FilterParams());
  goods = new LocalDataSource();
  totalItems = 0;

  get controls() {
    return this.comerEventForm.controls;
  }
  constructor(
    private parameterModService: ParameterModService,
    private fullService: FullService
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: {
        ...APPRAISAL_GOODS_TABLE_COLUMNS,
        item_avaluo: {
          title: 'Avalúo',
          sort: false,
          type: 'custom',
          filter: {
            type: 'list',
            config: {
              list: [
                { value: '', title: 'Todos' },
                { value: 'S', title: 'Si' },
                { value: 'N', title: 'No' },
              ],
            },
          },
          renderComponent: CheckboxElementComponent,
          showAlways: true,
          valuePrepareFunction: (isSelected: boolean, row: any) =>
            row.item_avaluo == 'S',
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            (instance.disabled = true),
        },
      },
      hideSubHeader: false,
      actions: false,
    };
  }

  ngOnInit(): void {
    this.onDownloadGoodsFormat().subscribe();
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

  onDownloadGoodsFormat() {
    return this.$downloadGoodsFormat.pipe(
      takeUntil(this.$unSubscribe),
      switchMap(() => this.donwnloadGoodsFormat())
    );
  }

  donwnloadGoodsFormat() {
    const { id_evento, item_tipo_proceso } = this.controls;
    const eventId = id_evento.value;
    const direction = this.global.direction;
    const pProcess = item_tipo_proceso.value;
    const params = this.params.getValue();
    this.fullService.generatingFileFlag.next({ progress: 99, showText: true });
    return this.parameterModService
      .getComerEventGoodsFormat(
        { eventId, direction, pProcess },
        params.getParams()
      )
      .pipe(
        catchError(error => {
          this.alert('error', UNEXPECTED_ERROR, '');
          return throwError(() => error);
        }),
        tap(resp => {
          if (resp.base64) {
            this._downloadExcelFromBase64(resp.base64, 'COMER_AVALUOS');
          }
        }),
        finalize(() => {
          this.fullService.generatingFileFlag.next({
            progress: 100,
            showText: true,
          });
        })
      );
  }

  columnsFilter() {
    return this.goods.onChanged().pipe(
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
    const pProcess = item_tipo_proceso.value;
    return this.parameterModService
      .getComerEventGoods({ eventId, direction, pProcess }, params.getParams())
      .pipe(
        catchError(error => {
          this.loading = false;
          this.goods.load([]);
          this.goods.refresh();
          this.totalItems = 0;
          return throwError(() => error);
        }),
        tap(response => {
          this.loading = false;
          console.log(response.data);
          this.goods.load(response.data);
          this.goods.refresh();
          this.totalItems = response.count;
        })
      );
  }

  resetTable() {
    this.goods.load([]);
    this.goods.refresh();
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
}

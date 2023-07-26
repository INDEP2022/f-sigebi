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
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ComerGoodsRejectedService } from 'src/app/core/services/ms-prepareevent/comer-goods-rejected.service';
import { BasePage } from 'src/app/core/shared';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { UNEXPECTED_ERROR } from 'src/app/utils/constants/common-errors';
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
  excelLoading = false;
  saleChangeLoading = false;
  vxrLoading = false;

  get controls() {
    return this.eventForm.controls;
  }

  constructor(
    private comerGoodsRejectedService: ComerGoodsRejectedService,
    private goodProcessService: GoodprocessService,
    private lotService: LotService,
    private authService: AuthService
  ) {
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
          valuePrepareFunction: (
            isSelected: boolean,
            row: IComerGoodRejected
          ) => this.isASaleGood(row),
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onSaleChange(instance),
        },
      },
      actions: false,
      hideSubHeader: false,
    };
  }

  isAVXRGood(_good: IComerGoodRejected) {
    const exists = this.vxrGoods.find(good => good.id == _good.id);
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
      this.vxrGoods = this.vxrGoods.filter(_good => _good.id != good.id);
      return;
    }
    if (good.status != 'VXR' || !good.status) {
      this.alert('error', 'Error', 'Este estatus no se puede incorporar');
      this.settings = { ...this.settings };
      return;
    }
    this.vxrGoods.push(good);
  }

  isASaleGood(_good: IComerGoodRejected) {
    const exists = this.saleGoods.find(good => good.id == _good.id);
    return exists ? true : false;
  }

  onSaleChange(instance: CheckboxElementComponent) {
    instance.toggle
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(({ row, toggle }) => this.saleChange(row, toggle))
      )
      .subscribe();
  }

  saleChange(good: IComerGoodRejected, selected: boolean) {
    if (!selected) {
      this.saleGoods = this.saleGoods.filter(_good => _good.id != good.id);
      return;
    }
    this.saleGoods.push(good);
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

  // ? --------------------- Incorporar

  onIncorporate() {
    if (!this.vxrGoods.length) {
      this.alert('error', 'Error', 'No se ha seleccionado ningún Bien');
      return;
    }
    this.incorporate().subscribe();
  }

  incorporate() {
    // TODO: MANDA 500 probar con evento - 11466
    const goods = this.vxrGoods.map(good => good.propertyNumber);
    const user = this.authService.decodeToken().preferred_username;
    this.vxrLoading = true;
    return this.lotService.incVXRGoods({ goods, user }).pipe(
      catchError(error => {
        console.log(error);
        this.vxrLoading = false;
        this.alert('error', 'Error', UNEXPECTED_ERROR);
        return throwError(() => error);
      }),
      tap(response => {
        console.log(response);
        this.alert(
          'success',
          'Los Bienes se han Actualizado para su Venta',
          ''
        );
        this.vxrLoading = false;
        this.vxrGoods = [];
        this.saleGoods = [];
        this.settings = { ...this.settings };
      })
    );
  }
  //  ? -------------------- Cambiar a venta
  onSale() {
    if (!this.saleGoods.length) {
      this.alert(
        'error',
        'Error',
        'No se ha seleccionado ningún Bien para Venta'
      );
      return;
    }
    this.changeToSale().subscribe();
  }

  changeToSale() {
    const goods = this.saleGoods.map(good => good.propertyNumber);
    this.saleChangeLoading = true;
    return this.goodProcessService.setStatusToSale({ goods }).pipe(
      catchError(error => {
        this.saleChangeLoading = false;
        this.alert('error', 'Error', UNEXPECTED_ERROR);
        return throwError(() => error);
      }),
      tap(res => {
        this.saleChangeLoading = false;
        this.alert(
          'success',
          'Los Bienes se han Actualizado para su Venta',
          ''
        );
        this.vxrGoods = [];
        this.saleGoods = [];
        this.settings = { ...this.settings };
      })
    );
  }

  //  ? ------------------- Exportar a Excel

  onExportExcel() {
    this.exportExcel().subscribe();
  }

  /**EXPORTA_RECHAZADOS */
  exportExcel() {
    const { id } = this.controls;
    this.excelLoading = true;
    return this.goodProcessService.exportRejectedGoods(id.value).pipe(
      catchError(error => {
        this.excelLoading = false;
        this.alert('error', 'Error', UNEXPECTED_ERROR);
        return throwError(() => error);
      }),
      tap(response => {
        this.excelLoading = false;
        this._downloadExcelFromBase64(
          response.base64File,
          `Bienes-Rechazados-${id.value}`
        );
      })
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { IComerGoodXLot } from 'src/app/common/constants/endpoints/ms-comersale/comer-good-x-lot.model';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IVJuridical } from 'src/app/core/models/ms-goods-query/v-juridical.model';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ComerGoodsXLotService } from 'src/app/core/services/ms-comersale/comer-goods-x-lot.service';
import { BasePage } from 'src/app/core/shared';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { UNEXPECTED_ERROR } from 'src/app/utils/constants/common-errors';
import { JURIDICAL_MODAL_COLUMNS } from '../../utils/table-columns/juridical-modal-columns';

@Component({
  selector: 'app-juridical-cell',
  templateUrl: './juridical-cell.component.html',
  styles: [],
})
export class JuridicalCellComponent extends BasePage implements OnInit {
  params = new BehaviorSubject(new FilterParams());
  totalItems = 0;
  juridicals = new LocalDataSource();
  good: IComerGoodXLot;
  selectedJuridical: string[] = [];
  confirmLoading = false;
  callback: (refresh: boolean) => any;
  constructor(
    private goodsqueryService: GoodsQueryService,
    private modalRef: BsModalRef,
    private comerGoodsXLotService: ComerGoodsXLotService
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: {
        ...JURIDICAL_MODAL_COLUMNS,
        selection: {
          title: 'Seleccionar',
          type: 'custom',
          sort: false,
          renderComponent: CheckboxElementComponent,
          filter: false,
          showAlways: true,
          valuePrepareFunction: (isSelected: boolean, row: IVJuridical) =>
            this.isJuridicalSelected(row),
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onSelectJuridical(instance),
        },
      },
      actions: false,
      hideSubHeader: false,
    };
  }

  isJuridicalSelected(juridical: IVJuridical) {
    const exists = this.selectedJuridical.find(key => key == juridical.key);
    return exists ? true : false;
  }

  onSelectJuridical(instance: CheckboxElementComponent) {
    instance.toggle
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(({ row, toggle }) => this.juridicalChange(row, toggle))
      )
      .subscribe();
  }

  juridicalChange(juridical: IVJuridical, selected: boolean) {
    if (!selected) {
      this.selectedJuridical = this.selectedJuridical.filter(
        key => key != juridical.key
      );
      return;
    }
    this.selectedJuridical.push(juridical.key);
  }

  ngOnInit(): void {
    this.selectedJuridical = this.good.field8?.split('/') ?? [];
    console.log(this.selectedJuridical);

    this.columnsFilter().subscribe();
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => {
          this.getJuridicalData(params).subscribe();
        })
      )
      .subscribe();
  }

  columnsFilter() {
    return this.juridicals.onChanged().pipe(
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

  getJuridicalData(params: FilterParams) {
    this.loading = true;
    return this.goodsqueryService.getVCatJur(params.getParams()).pipe(
      catchError(error => {
        this.loading = false;
        this.juridicals.load([]);
        this.juridicals.refresh();
        this.totalItems = 0;
        return throwError(() => error);
      }),
      tap(response => {
        this.loading = false;
        this.juridicals.load(response.data);
        this.juridicals.refresh();
        this.totalItems = response.count;
      })
    );
  }

  confirm() {
    const body = {
      goodNumber: this.good.goodNumber,
      idLot: this.good.idLot,
      field8: this.selectedJuridical.join('/'),
    };
    this.confirmLoading = true;
    this.comerGoodsXLotService
      .udpate(body)
      .pipe(
        catchError(error => {
          this.alert('error', 'Error', UNEXPECTED_ERROR);
          this.confirmLoading = false;
          return throwError(() => error);
        }),
        tap(response => {
          this.alert('success', 'El Bien ha sido Actualizado', '');
          this.confirmLoading = false;
          this.close(true);
        })
      )
      .subscribe();
  }

  close(refresh?: boolean) {
    this.modalRef.hide();
    if (refresh) {
      this.modalRef.content.callback(true);
    }
  }
}

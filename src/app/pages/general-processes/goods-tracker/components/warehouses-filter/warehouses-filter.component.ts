import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
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
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { EntFedService } from 'src/app/core/services/catalogs/entfed.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { BasePage } from 'src/app/core/shared';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { WAREHOUSES_FILTER_COLUMNS } from '../../utils/warehouses-filter-columns';

@Component({
  selector: 'app-warehouses-filter',
  templateUrl: './warehouses-filter.component.html',
  styles: [],
})
export class WarehousesFilterComponent extends BasePage implements OnInit {
  params = new BehaviorSubject(new FilterParams());
  totalItems = 0;
  warehouses = new LocalDataSource();
  form = this.fb.group({ state: new FormControl(null) });
  states = new DefaultSelect();
  selectedWarehouses: IWarehouse[] = [];
  callback: (warehouses: IWarehouse[]) => any;
  constructor(
    private warehouseService: WarehouseService,
    private fb: FormBuilder,
    private entFedService: EntFedService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: {
        ...WAREHOUSES_FILTER_COLUMNS,
        seleccionar: {
          title: 'Selección',
          sort: false,
          type: 'custom',
          showAlways: true,
          filter: false,
          valuePrepareFunction: (isSelected: boolean, row: IWarehouse) =>
            this.isWarehouseSelected(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onWarehouseSelect(instance),
        },
      },
      actions: false,
      hideSubHeader: false,
    };
  }

  isWarehouseSelected(_warehouse: IWarehouse) {
    const exists = this.selectedWarehouses.find(
      warehouse => warehouse.idWarehouse == _warehouse.idWarehouse
    );
    return exists ? true : false;
  }

  onWarehouseSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChange(data.row, data.toggle),
    });
  }

  goodSelectedChange(warehosue: IWarehouse, selected: boolean) {
    if (selected) {
      this.selectedWarehouses.push(warehosue);
    } else {
      this.selectedWarehouses = this.selectedWarehouses.filter(
        _warehouse => _warehouse.idWarehouse != warehosue.idWarehouse
      );
    }
  }

  ngOnInit(): void {
    this.columnsFilter().subscribe();
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => this.getLots(params).subscribe())
      )
      .subscribe();
  }

  columnsFilter() {
    return this.warehouses.onChanged().pipe(
      distinctUntilChanged(),
      debounceTime(500),
      takeUntil(this.$unSubscribe),
      tap(dataSource => this.buildColumnFilter(dataSource))
    );
  }

  buildColumnFilter(dataSource: any) {
    const params = new FilterParams();
    params.addFilter('stateCode.id', this.form.controls.state.value ?? '');
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
          operator || SearchFilter.ILIKE
        );
      });
      this.params.next(params);
    }
  }

  getLots(params: FilterParams) {
    this.loading = true;
    return this.warehouseService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        this.loading = false;
        this.warehouses.load([]);
        this.warehouses.refresh();
        this.totalItems = 0;
        return throwError(() => error);
      }),
      tap(response => {
        this.loading = false;
        console.log(response.data);
        this.warehouses.load(response.data);
        this.warehouses.refresh();
        this.totalItems = response.count;
      })
    );
  }

  getStates(params: ListParams) {
    this.entFedService
      .getAll(params)
      .pipe(
        catchError(error => {
          this.states = new DefaultSelect([], 0);
          return throwError(() => error);
        }),
        tap(response => {
          this.states = new DefaultSelect(response.data, response.count);
        })
      )
      .subscribe();
  }

  search() {
    this.warehouses.setFilter([
      { field: 'description', search: '' },
      { field: 'ubication', search: '' },
    ]);
  }

  confirm() {
    this.modalRef.content.callback(this.selectedWarehouses);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.content.callback([]);
    this.modalRef.hide();
  }
}

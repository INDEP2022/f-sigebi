import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { IWarehouse } from '../../../../core/models/catalogs/warehouse.model';
import { WarehouseService } from '../../../../core/services/catalogs/warehouse.service';
import { WarehousesDetailComponent } from '../warehouses-detail/warehouses-detail.component';
import { WAREHOUSE_COLUMNS } from './warehouse-columns';

@Component({
  selector: 'app-warehouses-list',
  templateUrl: './warehouses-list.component.html',
  styles: [],
})
export class WarehousesListComponent extends BasePage implements OnInit {
  warehouses: IWarehouse[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private warehouseService: WarehouseService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = WAREHOUSE_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            // filter.field == 'id'
            //   ? (searchFilter = SearchFilter.EQ)
            //   : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getWarehouses();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getWarehouses());
  }

  getWarehouses() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.warehouseService.getAll(params).subscribe({
      next: response => {
        this.warehouses = response.data;
        this.data.load(this.warehouses);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(warehouse?: IWarehouse) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      warehouse,
      callback: (next: boolean) => {
        if (next) this.getWarehouses();
      },
    };
    this.modalService.show(WarehousesDetailComponent, modalConfig);
  }

  showDeleteAlert(warehouse: IWarehouse) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(warehouse.idWarehouse);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.warehouseService.remove(id).subscribe({
      next: () => this.getWarehouses(),
    });
  }
}

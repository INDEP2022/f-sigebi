import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalListGoodsComponent } from '../modal-list-goods/modal-list-goods.component';
import { COUNT_WAREHOUSE_COLUMNS } from '../warehouse-columns';

export interface ExampleWarehouse {
  number: number;
  description: string;
  location: string;
  responsible: string;
  entity: string;
  municipality: string;
  city: string;
  locality: string;
  goods?: ExapleGoods[];
}

export interface ExapleGoods {
  numberGood: number;
  description: string;
  quantity: number;
  dossier: string;
}

@Component({
  selector: 'app-warehouse-inquiries',
  templateUrl: './warehouse-inquiries.component.html',
  styles: [],
})
export class WarehouseInquiriesComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  //Data Table
  warehouses: any[] = [];
  dataFactGen: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private modalService: BsModalService,
    private warehouseService: WarehouseService
  ) {
    super();

    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        edit: false,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...COUNT_WAREHOUSE_COLUMNS },
      noDataMessage: 'No se encontrarón registros',
    };
  }

  ngOnInit(): void {
    // this.params
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.getWarehouses());
    this.dataFactGen
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'idWarehouse' ||
            filter.field == 'description' ||
            filter.field == 'ubication' ||
            filter.field == 'manager' ||
            filter.field == 'stateCode' ||
            filter.field == 'municipalityCode' ||
            filter.field == 'cityCode' ||
            filter.field == ' localityCode'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getWarehouses();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getWarehouses());
  }

  select(event: IWarehouse) {
    event
      ? this.openModal(event.idWarehouse)
      : this.alert('info', 'Ooop...', 'Éste Almacén no contiene Bienes');
  }

  openModal(idWarehouse: any): void {
    this.modalService.show(ModalListGoodsComponent, {
      initialState: idWarehouse,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
  getWarehouses() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.warehouseService.getAll(params).subscribe({
      next: response => {
        this.warehouses = response.data.map(ware => {
          return {
            idWarehouse: ware.idWarehouse,
            description: ware.description,
            indActive: ware.indActive,
            localityCode: ware.localityCode
              ? ware.localityCode.nameLocation
              : null,
            cityCode: ware.cityCode ? ware.cityCode.nameCity : '',
            manager: ware.manager,
            municipalityCode: ware.municipalityCode
              ? ware.municipalityCode.nameMunicipality
              : null,
            registerNumber: ware.registerNumber,
            responsibleDelegation: ware.responsibleDelegation,
            stateCode: ware.stateCode ? ware.stateCode.descCondition : '',
            type: ware.type,
            ubication: ware.ubication,
          };
        });
        this.dataFactGen.load(this.warehouses);
        this.dataFactGen.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
}

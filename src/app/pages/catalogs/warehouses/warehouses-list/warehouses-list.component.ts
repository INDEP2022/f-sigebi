import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
    private modalService: BsModalService,
    private tvalTable1Service: TvalTable1Service,
    private securityService: SecurityService
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
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'idWarehouse':
                searchFilter = SearchFilter.EQ;
                break;
              case 'stateCode':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.descCondition`;
                break;
              case 'cityCode':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.nameCity`;
                break;
              case 'municipalityCode':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.nameMunicipality`;
                break;
              case 'localityCode':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.nameLocation`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              console.log(
                (this.columnFilters[field] = `${searchFilter}:${filter.search}`)
              );
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          console.log('this.params:', this.params);
          this.params = this.pageFilter(this.params);
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
        // this.getDetType(response).then(() => {
        //   this.getUser();
        // }).catch((error) => {
        this.warehouses = response.data;
        console.log(response.data);
        this.data.load(this.warehouses);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
        // });
      },
      error: error => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }
  async getDetType(response: any): Promise<void> {
    for (let i = 0; i < response.data.length; i++) {
      const params = new ListParams();
      params['filter.nmtable'] = `$eq:432`;
      params['filter.otkey'] = `$eq:${response.data[i].type}`;
      if (response.data[i].type) {
        this.tvalTable1Service.getAlls(params).subscribe({
          next: resp => {
            console.log(resp.data[0].otvalor);
            response.data[i].detType = resp.data[0].otvalor;
          },
          error: erro => console.log(erro),
          complete: () => {
            if (i == response.data.length - 1) {
              this.warehouses = response.data;
              console.log(response.data);
              this.data.load(this.warehouses);
              this.data.refresh();
              this.totalItems = response.count;
              this.loading = false;
            }
          },
        });
      } else if (i == response.data.length - 1) {
        this.warehouses = response.data;
        console.log(response.data);
        this.data.load(this.warehouses);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      }
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  async getUser(): Promise<void> {
    for (let i = 0; i < this.warehouses.length; i++) {
      const params = new ListParams();
      params['filter.user'] = `$eq:${this.warehouses[i].manager}`;
      if (this.warehouses[i].manager) {
        this.securityService.getAllUsersTracker(params).subscribe({
          next: resp => {
            console.log(resp.data[0].name);
            this.warehouses[i].DetManager = resp.data[0].name;
          },
          error: erro => console.log(erro),
          complete: () => {
            if (i == this.warehouses.length - 1) {
              this.warehouses = this.warehouses;
              console.log(this.warehouses);
              this.data.load(this.warehouses);
              this.data.refresh();
              this.loading = false;
            }
          },
        });
      } else if (i == this.warehouses.length - 1) {
        this.warehouses = this.warehouses;
        console.log(this.warehouses);
        this.data.load(this.warehouses);
        this.data.refresh();
        this.loading = false;
      }
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  openForm(warehouse?: IWarehouse) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      warehouse,
      callback: (next: boolean) => {
        if (next) {
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getWarehouses());
        }
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
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.warehouseService.remove(id).subscribe({
      next: () => {
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getWarehouses());
        //this.getWarehouses();
        this.alert(
          'success',
          'Categoria para Almacen',
          'Borrada Correctamente'
        );
      },
      error: err => {
        this.alert(
          'warning',
          'Categoria para Almacen',
          'No se puede eliminar el objeto debido a una relación con un lote'
        );
        return;
        //console.log(err);
      },
    });
  }
}

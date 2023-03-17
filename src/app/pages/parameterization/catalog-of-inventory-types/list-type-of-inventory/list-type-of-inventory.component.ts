import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IInventoryQuery,
  TypesInventory,
} from 'src/app/core/models/ms-inventory-query/inventory-query.model';
import { InventoryTypeService } from 'src/app/core/services/ms-inventory-type/inventory-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CatalogOfInventoryTypesComponent } from '../catalog-of-inventory-types/catalog-of-inventory-types.component';
import { ModalCatalogOfInventoryTypesComponent } from '../modal-catalog-of-inventory-types/modal-catalog-of-inventory-types.component';
import {
  DETAIL_INVENTORI_TYPE_COLUMNS,
  DETAIL_INVENTOTY_COLUMNS,
} from './columns';

@Component({
  selector: 'app-list-type-of-inventory',
  templateUrl: './list-type-of-inventory.component.html',
  styles: [],
})
export class ListTypeOfInventoryComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  dataInventory: TypesInventory[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  dataInventoryType: IInventoryQuery[] = [];
  data1: LocalDataSource = new LocalDataSource();
  columnFilters1: any = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;
  settings2 = { ...this.settings };
  inventory: any;
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private inventoryServ: InventoryTypeService
  ) {
    super();
    this.settings.columns = DETAIL_INVENTOTY_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
    this.settings2.columns = DETAIL_INVENTORI_TYPE_COLUMNS;
    this.settings2.actions.add = false;
    this.settings2 = {
      ...this.settings2,
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
          this.getInventory();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInventory());
    this.data1
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
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.getInventoryType();
        }
      });
    this.params1
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInventoryType());
  }

  getInventory() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.inventoryServ.getAllWithFilters(params).subscribe({
      next: response => {
        console.log(response);
        this.dataInventory = response.data;
        this.data.load(this.dataInventory);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.onLoadToast('error', err.error.message, '');
      },
    });
  }
  getInventoryType() {
    this.loading = true;
    let params = {
      ...this.params1.getValue(),
      ...this.columnFilters1,
    };
    this.inventoryServ.getAllWithFiltersDetails(params).subscribe({
      next: response => {
        console.log(response);
        this.dataInventoryType = response.data;
        this.data1.load(this.dataInventoryType);
        this.data1.refresh();
        this.totalItems1 = response.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.onLoadToast('error', err.error.message, '');
      },
    });
  }

  deleteType(type: TypesInventory) {
    console.log(type);
    this.params1.getValue()['filter.cveTypeInventory'] = type.cveTypeInventory;
    this.inventoryServ
      .getAllWithFiltersDetails(this.params1.getValue())
      .subscribe({
        next: response => {
          if (response) {
            this.alert(
              'error',
              'Debe eliminar los detalles de tipo inventario primero',
              ''
            );
          }
        },
        error: err => {
          if (err.status === 400) {
            this.alertQuestion(
              'warning',
              'Eliminar',
              'Desea eliminar este registro?'
            ).then(question => {
              if (question.isConfirmed) {
                this.inventoryServ
                  .removeInventory(type.cveTypeInventory)
                  .subscribe({
                    next: () => {
                      this.alert('success', 'Ha sido eliminado', '');
                      this.params
                        .pipe(takeUntil(this.$unSubscribe))
                        .subscribe(() => this.getInventory());
                    },
                    error: err =>
                      this.onLoadToast('error', err.error.message, ''),
                  });
              }
            });
          }
        },
      });
  }
  deleteTypeDetail(typeDetail: IInventoryQuery) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.inventoryServ.remove(typeDetail.noTypeInventory).subscribe({
          next: () => {
            this.params1 = new BehaviorSubject<ListParams>(new ListParams());
            this.alert('success', 'Ha sido eliminado', '');
            this.getInventoryType();
          },
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      }
    });
  }
  rowsSelected(event: any) {
    console.log(event);
    this.inventory = event;
  }
  public openForm(allotment?: TypesInventory) {
    let config: ModalOptions = {
      initialState: {
        allotment,
        callback: (next: boolean) => {
          if (next) {
            this.params1 = new BehaviorSubject<ListParams>(new ListParams());
            this.params1
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getInventoryType());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalCatalogOfInventoryTypesComponent, config);
  }
  public openFormInventory(allotment?: TypesInventory) {
    let config: ModalOptions = {
      initialState: {
        allotment,
        callback: (next: boolean) => {
          if (next) {
            this.params1
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getInventory());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CatalogOfInventoryTypesComponent, config);
  }
  public openFormType() {
    if (this.inventory) {
      let data = this.inventory;
      let config: ModalOptions = {
        initialState: {
          data,
          callback: (next: boolean) => {
            if (next) {
              this.params1 = new BehaviorSubject<ListParams>(new ListParams());
              this.params1
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe(() => this.getInventoryType());
            }
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(ModalCatalogOfInventoryTypesComponent, config);
    } else {
      this.alert(
        'warning',
        'Advertencia',
        'Se debe seleccionar un tipo de inventario'
      );
    }
  }
}

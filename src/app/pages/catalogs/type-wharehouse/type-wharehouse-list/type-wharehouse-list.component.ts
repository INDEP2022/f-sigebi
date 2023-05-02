import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITypeWarehouse } from 'src/app/core/models/catalogs/type-warehouse.model';
import { TypeWarehouseService } from 'src/app/core/services/catalogs/type-warehouse.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TypeWharehouseFromComponent } from '../type-wharehouse-from/type-wharehouse-from.component';
import { TYPESWHAREHOUSE_COLUMS } from './type-wharehouse-columns';

@Component({
  selector: 'app-type-wharehouse-list',
  templateUrl: './type-wharehouse-list.component.html',
  styles: [],
})
export class TypeWharehouseListComponent extends BasePage implements OnInit {
  paragraphs: ITypeWarehouse[] = [];
  data: LocalDataSource = new LocalDataSource();

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  columnFilters: any = [];

  constructor(
    private typeWarehouseService: TypeWarehouseService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = TYPESWHAREHOUSE_COLUMS;
    this.settings = {
      ...this.settings,
      actions: {
        ...this.settings.actions,
        delete: true,
        add: false,
      },
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
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'status':
                searchFilter = SearchFilter.EQ;
                break;
              case 'version':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getExample();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.typeWarehouseService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.data.load(this.paragraphs);
        this.totalItems = response.count || 0;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(typeWarehouse?: ITypeWarehouse) {
    let config: ModalOptions = {
      initialState: {
        typeWarehouse,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TypeWharehouseFromComponent, config);
  }

  delete(typeWarehouse: ITypeWarehouse) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.typeWarehouseService.remove(typeWarehouse.id).subscribe({
          next: response => {
            this.onLoadToast('success', 'Exito', 'Eliminado Correctamente');
            this.getExample();
          },
          error: err => {
            this.onLoadToast('error', 'Error', 'Intente nuevamente');
          },
        });
        //Ejecutar el servicio
      }
    });
  }
}

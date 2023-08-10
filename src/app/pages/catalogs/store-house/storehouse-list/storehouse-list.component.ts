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
import { IStorehouse } from '../../../../core/models/catalogs/storehouse.model';
import { StorehouseService } from '../../../../core/services/catalogs/storehouse.service';
import { StorehouseDetailComponent } from '../storehouse-detail/storehouse-detail.component';
import { STOREHOUSE_COLUMNS } from './storehouse-columns';

@Component({
  selector: 'app-storehouse-list',
  templateUrl: './storehouse-list.component.html',
  styles: [],
})
export class StorehouseListComponent extends BasePage implements OnInit {
  storeHouse: IStorehouse[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private storehouseService: StorehouseService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = STOREHOUSE_COLUMNS;
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
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'idSafe':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'idEntity':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            /*filter.field == 'id' ||
            filter.field == 'manager' ||
            filter.field == 'description' ||
            filter.field == 'municipality' ||
            filter.field == 'locality' ||
            filter.field == 'ubication' ||
            filter.field == 'idEntity'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);*/
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getStorehouses();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getStorehouses());
  }

  getStorehouses() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.storehouseService.getAll(params).subscribe({
      next: response => {
        this.totalItems = response.count;
        this.storeHouse = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  openForm(storeHouse?: IStorehouse) {
    console.log(storeHouse);
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      storeHouse,
      callback: (next: boolean) => {
        if (next) this.getStorehouses();
      },
    };
    this.modalService.show(StorehouseDetailComponent, modalConfig);
  }

  showDeleteAlert(storeHouse: IStorehouse) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este Registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(storeHouse.id);
      }
    });
  }

  delete(id: number) {
    this.storehouseService.remove(id).subscribe({
      next: () => {
        this.getStorehouses(),
          this.alert('success', 'Bodega', 'Borrada Correctamente');
      },
      error: err => {
        this.alert(
          'warning',
          'Bodegas',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}

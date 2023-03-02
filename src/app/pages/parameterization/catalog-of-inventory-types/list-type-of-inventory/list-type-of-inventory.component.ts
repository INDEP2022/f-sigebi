import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { TypesInventory } from 'src/app/core/models/ms-inventory-query/inventory-query.model';
import { InventoryTypeService } from 'src/app/core/services/ms-inventory-type/inventory-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-list-type-of-inventory',
  templateUrl: './list-type-of-inventory.component.html',
  styles: [],
})
export class ListTypeOfInventoryComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter: SearchBarFilter;
  dataInventory: IListResponse<TypesInventory> =
    {} as IListResponse<TypesInventory>;
  filter = new FilterParams();

  constructor(
    private modalRef: BsModalRef,
    private inventoryServ: InventoryTypeService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = true;
    this.searchFilter = { field: 'description', operator: SearchFilter.ILIKE };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInventory());
  }

  getInventory() {
    this.loading = true;
    this.inventoryServ
      .getAllWithFilters(this.params.getValue().getParams())
      .subscribe({
        next: response => {
          this.dataInventory = response;
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          this.onLoadToast('error', err.error.message, '');
        },
      });
  }

  formDataType(type: TypesInventory) {
    this.modalRef.content.callback(true, type);
    this.modalRef.hide();
  }
  deleteType(type: TypesInventory) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.inventoryServ.removeInventory(type.cveTypeInventory).subscribe({
          next: () => {
            this.onLoadToast('success', 'Ha sido eliminado', '');
            this.getInventory();
          },
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      }
    });
  }

  close() {
    this.modalRef.hide();
  }
}

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IWarehouse } from '../../../../core/models/catalogs/warehouse.model';
import { WarehouseService } from '../../../../core/services/catalogs/warehouse.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { WAREHOUSE_COLUMNS } from './warehouse-columns';
import { WarehousesDetailComponent } from '../warehouses-detail/warehouses-detail.component';

@Component({
  selector: 'app-warehouses-list',
  templateUrl: './warehouses-list.component.html',
  styles: [],
})
export class WarehousesListComponent extends BasePage implements OnInit {
  
  warehouses: IWarehouse[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private warehouseService: WarehouseService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = WAREHOUSE_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getWarehouses());
  }

  getWarehouses() {
    this.loading = true;
    this.warehouseService.getAll(this.params.getValue()).subscribe(
      response => {
        this.warehouses = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  add() {
    this.openModal();
  }

  openModal(context?: Partial<WarehousesDetailComponent>) {
    const modalRef = this.modalService.show(WarehousesDetailComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getWarehouses();
    });
  }

  edit(warehouse: IWarehouse) {
    this.openModal({ edit: true, warehouse });
  }

  delete(warehouse: IWarehouse) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}

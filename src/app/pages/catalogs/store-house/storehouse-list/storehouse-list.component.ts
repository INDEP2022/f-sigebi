import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
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
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private storehouseService: StorehouseService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = STOREHOUSE_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getStorehouses());
  }

  getStorehouses() {
    this.loading = true;
    this.storehouseService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.storeHouse = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(storeHouse?: IStorehouse) {
    const modalConfig = MODAL_CONFIG;
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
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(storeHouse.idStorehouse);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string) {
    this.storehouseService.remove(id).subscribe({
      next: () => this.getStorehouses(),
    });
  }
}

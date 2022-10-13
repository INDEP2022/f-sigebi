import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { IStorehouse } from '../../../../core/models/catalogs/storehouse.model';
import { STOREHOUSE_COLUMNS } from './storehouse-columns';
import { StorehouseService } from '../../../../core/services/catalogs/storehouse.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { StorehouseDetailComponent } from '../storehouse-detail/storehouse-detail.component';

@Component({
  selector: 'app-storehouse-list',
  templateUrl: './storehouse-list.component.html',
  styles: [],
})
export class StorehouseListComponent extends BasePage implements OnInit {
  
  lawyers: IStorehouse[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private StorehouseService: StorehouseService,
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
    this.StorehouseService.getAll(this.params.getValue()).subscribe(
      response => {
        this.lawyers = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  add() {
    this.openModal();
  }

  openModal(context?: Partial<StorehouseDetailComponent>) {
    const modalRef = this.modalService.show(StorehouseDetailComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getStorehouses();
    });
  }

  edit(storehouse: IStorehouse) {
    this.openModal({ edit: true, storehouse });
  }

  delete(bank: IStorehouse) {
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

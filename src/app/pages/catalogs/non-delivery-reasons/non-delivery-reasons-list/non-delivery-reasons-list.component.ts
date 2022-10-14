import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

import { INonDeliveryReason } from '../../../../core/models/catalogs/non-delivery-reason.model';
import { NonDeliveryReasonService } from '../../../../core/services/catalogs/non-delivery-reason.service';
import { NON_DELIVERY_REASONS_COLUMNS } from './non-delivery-reasons-columns';
import { NonDeliveryReasonsFormComponent } from '../non-delivery-reasons-form/non-delivery-reasons-form.component';

@Component({
  selector: 'app-non-delivery-reasons-list',
  templateUrl: './non-delivery-reasons-list.component.html',
  styles: [],
})
export class NonDeliveryReasonsListComponent extends BasePage implements OnInit {

  
  columns: INonDeliveryReason[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private nonDeliveryReasonsService: NonDeliveryReasonService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = NON_DELIVERY_REASONS_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.nonDeliveryReasonsService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<NonDeliveryReasonsFormComponent>) {
    const modalRef = this.modalService.show(NonDeliveryReasonsFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(nonDeliveryReasons?: INonDeliveryReason) {
    this.openModal({ nonDeliveryReasons });
  }

  delete(batch: INonDeliveryReason) {
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

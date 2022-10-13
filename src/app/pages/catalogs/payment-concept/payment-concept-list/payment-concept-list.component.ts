import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { PaymentConceptService } from 'src/app/core/services/catalogs/payment-concept.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IPaymentConcept } from '../../../../core/models/catalogs/payment-concept.model';
import { PAYMENT_CONCEPT_COLUMNS } from './payment-concept-columns';
import { PaymentConceptDetailComponent } from '../payment-concept-detail/payment-concept-detail.component';

@Component({
  selector: 'app-payment-concept-list',
  templateUrl: './payment-concept-list.component.html',
  styles: [],
})
export class PaymentConceptListComponent extends BasePage implements OnInit {
  
  payments: IPaymentConcept[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private paymentService: PaymentConceptService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = PAYMENT_CONCEPT_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getPaymentConcepts());
  }

  getPaymentConcepts() {
    this.loading = true;
    this.paymentService.getAll(this.params.getValue()).subscribe(
      response => {
        this.payments = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  add() {
    this.openModal();
  }

  openModal(context?: Partial<PaymentConceptDetailComponent>) {
    const modalRef = this.modalService.show(PaymentConceptDetailComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getPaymentConcepts();
    });
  }

  edit(payment: IPaymentConcept) {
    this.openModal({ edit: true, payment });
  }

  delete(payment: IPaymentConcept) {
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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { PaymentConceptDetailComponent } from './payment-concept-detail/payment-concept-detail.component';
import { PaymentConceptListComponent } from './payment-concept-list/payment-concept-list.component';
import { PaymentConceptRoutingModule } from './payment-concept-routing.module';

@NgModule({
  declarations: [PaymentConceptDetailComponent, PaymentConceptListComponent],
  imports: [
    CommonModule,
    PaymentConceptRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class PaymentConceptModule {}

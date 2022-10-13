import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentConceptRoutingModule } from './payment-concept-routing.module';
import { PaymentConceptDetailComponent } from './payment-concept-detail/payment-concept-detail.component';
import { PaymentConceptListComponent } from './payment-concept-list/payment-concept-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentSearchListComponent } from './payment-search-list/payment-search-list.component';
import { PaymentSearchModalComponent } from './payment-search-modal/payment-search-modal.component';
import { PaymentSearchRoutingModule } from './payment-search-routing.module';

@NgModule({
  declarations: [PaymentSearchListComponent, PaymentSearchModalComponent],
  imports: [
    CommonModule,
    PaymentSearchRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    NgScrollbarModule,
  ],
})
export class PaymentSearchModule {}

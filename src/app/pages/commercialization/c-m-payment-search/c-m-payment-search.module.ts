import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CMPaymentSearchListComponent } from './c-m-payment-search-list/c-m-payment-search-list.component';
import { CMPaymentSearchModalComponent } from './c-m-payment-search-modal/c-m-payment-search-modal.component';
import { CMPaymentSearchRoutingModule } from './c-m-payment-search-routing.module';

@NgModule({
  declarations: [CMPaymentSearchListComponent, CMPaymentSearchModalComponent],
  imports: [
    CommonModule,
    CMPaymentSearchRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CMPaymentSearchModule {}

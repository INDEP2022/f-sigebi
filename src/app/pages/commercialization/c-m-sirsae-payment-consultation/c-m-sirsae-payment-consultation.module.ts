import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { CMSirsaePaymentConsultationRoutingModule } from './c-m-sirsae-payment-consultation-routing.module';
import { CMSirsaePaymentConsultationListComponent } from './c-m-sirsae-payment-consultation-list/c-m-sirsae-payment-consultation-list.component';

@NgModule({
  declarations: [CMSirsaePaymentConsultationListComponent],
  imports: [
    CommonModule,
    CMSirsaePaymentConsultationRoutingModule,
    SharedModule,
  ],
})
export class CMSirsaePaymentConsultationModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { SharedModule } from 'src/app/shared/shared.module';
import { CMSirsaePaymentConsultationListComponent } from './c-m-sirsae-payment-consultation-list/c-m-sirsae-payment-consultation-list.component';
import { CMSirsaePaymentConsultationRoutingModule } from './c-m-sirsae-payment-consultation-routing.module';

@NgModule({
  declarations: [CMSirsaePaymentConsultationListComponent],
  imports: [
    CommonModule,
    CMSirsaePaymentConsultationRoutingModule,
    SharedModule,
    CollapseModule.forRoot(),
  ],
})
export class CMSirsaePaymentConsultationModule {}

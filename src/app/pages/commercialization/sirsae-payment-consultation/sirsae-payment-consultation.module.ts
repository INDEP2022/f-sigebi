import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { SharedModule } from 'src/app/shared/shared.module';
import { SirsaePaymentConsultationListComponent } from './sirsae-payment-consultation-list/sirsae-payment-consultation-list.component';
import { SirsaePaymentConsultationRoutingModule } from './sirsae-payment-consultation-routing.module';

@NgModule({
  declarations: [SirsaePaymentConsultationListComponent],
  imports: [
    CommonModule,
    SirsaePaymentConsultationRoutingModule,
    SharedModule,
    CollapseModule.forRoot(),
  ],
})
export class SirsaePaymentConsultationModule {}

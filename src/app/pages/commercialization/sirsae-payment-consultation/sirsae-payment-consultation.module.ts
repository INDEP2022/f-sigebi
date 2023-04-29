import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
import { CustomSelectComponent } from 'src/app/@standalone/shared-forms/custom-select/custom-select.component';
import { GoodsSharedComponent } from 'src/app/@standalone/shared-forms/goods-shared/goods-shared.component';
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
    BanksSharedComponent,
    GoodsSharedComponent,
    CustomSelectComponent,
  ],
})
export class SirsaePaymentConsultationModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';

import { ExcelService } from 'src/app/common/services/exporttoexcel.service';

import { CBVdpMPaymentDispersionValidationRoutingModule } from './c-b-vdp-m-payment-dispersion-validation-routing.module';
import { CBVdpCPaymentDispersionValidationComponent } from './c-b-vdp-c-payment-dispersion-validation/c-b-vdp-c-payment-dispersion-validation.component';

import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';

@NgModule({
  declarations: [CBVdpCPaymentDispersionValidationComponent],
  imports: [
    CommonModule,
    CBVdpMPaymentDispersionValidationRoutingModule,
    SharedModule,
    EventsSharedComponent
  ],
  providers: [ExcelService],
})
export class CBVdpMPaymentDispersionValidationModule {}

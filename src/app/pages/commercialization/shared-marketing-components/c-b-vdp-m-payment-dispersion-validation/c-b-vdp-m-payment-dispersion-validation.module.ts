import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';

import { ExcelService } from 'src/app/common/services/exportToExcel.service';

import { CBVdpMPaymentDispersionValidationRoutingModule } from './c-b-vdp-m-payment-dispersion-validation-routing.module';
import { CBVdpCPaymentDispersionValidationComponent } from './c-b-vdp-c-payment-dispersion-validation/c-b-vdp-c-payment-dispersion-validation.component';

@NgModule({
  declarations: [CBVdpCPaymentDispersionValidationComponent],
  imports: [
    CommonModule,
    CBVdpMPaymentDispersionValidationRoutingModule,
    SharedModule,
  ],
  providers: [ExcelService],
})
export class CBVdpMPaymentDispersionValidationModule {}

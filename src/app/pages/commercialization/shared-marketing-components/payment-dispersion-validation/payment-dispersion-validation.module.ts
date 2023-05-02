import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { ExcelService } from 'src/app/common/services/excel.service';

import { PaymentDispersionValidationRoutingModule } from './payment-dispersion-validation-routing.module';
import { PaymentDispersionValidationComponent } from './payment-dispersion-validation/payment-dispersion-validation.component';

import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';

@NgModule({
  declarations: [PaymentDispersionValidationComponent],
  imports: [
    CommonModule,
    PaymentDispersionValidationRoutingModule,
    SharedModule,
    EventsSharedComponent,
  ],
  providers: [ExcelService],
})
export class PaymentDispersionValidationModule {}

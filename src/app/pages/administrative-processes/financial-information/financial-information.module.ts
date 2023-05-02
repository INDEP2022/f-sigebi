import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { FinancialInformationRoutingModule } from './financial-information-routing.module';
import { FinancialInformationComponent } from './financial-information/financial-information.component';

@NgModule({
  declarations: [FinancialInformationComponent],
  imports: [
    CommonModule,
    FinancialInformationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class FinancialInformationModule {}

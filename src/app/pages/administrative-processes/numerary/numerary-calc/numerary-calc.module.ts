import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { NgxCurrencyModule } from 'ngx-currency';
import { SharedModule } from '../../../../shared/shared.module';
import { ModalRequestComponent } from './modal-request/modal-request.component';
import { NumeraryCalcRoutingModule } from './numerary-calc-routing.module';
import { NumeraryCalcComponent } from './numerary-calc.component';

export const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  allowZero: true,
  decimal: '.',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: ',',
  nullable: false,
};

@NgModule({
  declarations: [NumeraryCalcComponent, ModalRequestComponent],
  imports: [
    CommonModule,
    NumeraryCalcRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
})
export class NumeraryCalcModule {}

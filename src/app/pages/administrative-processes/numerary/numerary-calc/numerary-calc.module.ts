import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { NumeraryCalcRoutingModule } from './numerary-calc-routing.module';
import { NumeraryCalcComponent } from './numerary-calc.component';

@NgModule({
  declarations: [NumeraryCalcComponent],
  imports: [
    CommonModule,
    NumeraryCalcRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class NumeraryCalcModule {}

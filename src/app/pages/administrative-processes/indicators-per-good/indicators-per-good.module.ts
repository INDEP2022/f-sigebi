import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { IndicatorsPerGoodRoutingModule } from './indicators-per-good-routing.module';
import { IndicatorsPerGoodComponent } from './indicators-per-good/indicators-per-good.component';

@NgModule({
  declarations: [IndicatorsPerGoodComponent],
  imports: [
    CommonModule,
    IndicatorsPerGoodRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class IndicatorsPerGoodModule {}

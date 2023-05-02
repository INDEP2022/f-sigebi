import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { IndicatorsSatRoutingModule } from './indicators-sat-routing.module';
import { IndicatorsSatComponent } from './indicators-sat/indicators-sat.component';

@NgModule({
  declarations: [IndicatorsSatComponent],
  imports: [CommonModule, IndicatorsSatRoutingModule, SharedModule],
})
export class IndicatorsSatModule {}

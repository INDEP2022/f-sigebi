import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { IndicatorsOfPerformanceRoutingModule } from './indicators-of-performance-routing.module';
import { IndicatorsOfPerformanceComponent } from './indicators-of-performance/indicators-of-performance.component';

@NgModule({
  declarations: [IndicatorsOfPerformanceComponent],
  imports: [
    CommonModule,
    IndicatorsOfPerformanceRoutingModule,
    SharedModule,
    TimepickerModule.forRoot(),
  ],
})
export class IndicatorsOfPerformanceModule {}

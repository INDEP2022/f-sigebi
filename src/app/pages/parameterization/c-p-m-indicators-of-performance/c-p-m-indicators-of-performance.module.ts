import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPMIndicatorsOfPerformanceRoutingModule } from './c-p-m-indicators-of-performance-routing.module';
import { CPMIndicatorsOfPerformanceComponent } from './c-p-m-indicators-of-performance/c-p-m-indicators-of-performance.component';

@NgModule({
  declarations: [CPMIndicatorsOfPerformanceComponent],
  imports: [
    CommonModule,
    CPMIndicatorsOfPerformanceRoutingModule,
    SharedModule,
    TimepickerModule.forRoot(),
  ],
})
export class CPMIndicatorsOfPerformanceModule {}

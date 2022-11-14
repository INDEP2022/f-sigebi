import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CPMIndicatorsOfPerformanceRoutingModule } from './c-p-m-indicators-of-performance-routing.module';
import { CPMIndicatorsOfPerformanceComponent } from './c-p-m-indicators-of-performance/c-p-m-indicators-of-performance.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';


@NgModule({
  declarations: [
    CPMIndicatorsOfPerformanceComponent
  ],
  imports: [
    CommonModule,
    CPMIndicatorsOfPerformanceRoutingModule,
    SharedModule,
    TimepickerModule.forRoot(),
  ]
})
export class CPMIndicatorsOfPerformanceModule { }

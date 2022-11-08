import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceIndicatorRoutingModule } from './performance-indicator-routing.module';
import { PerformanceIndicatorComponent } from './performance-indicator/performance-indicator.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PerformanceIndicatorStrategyComponent } from './performance-indicator-strategy/performance-indicator-strategy.component';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    PerformanceIndicatorComponent,
    PerformanceIndicatorStrategyComponent
  ],
  exports: [
    PerformanceIndicatorStrategyComponent
  ],
  imports: [
    CommonModule,
    PerformanceIndicatorRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ]
})
export class PerformanceIndicatorModule { }

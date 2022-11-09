import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { PerformanceIndicatorRoutingModule } from './performance-indicator-routing.module';
import { PerformanceIndicatorStrategyComponent } from './performance-indicator-strategy/performance-indicator-strategy.component';
import { PerformanceIndicatorComponent } from './performance-indicator/performance-indicator.component';

@NgModule({
  declarations: [
    PerformanceIndicatorComponent,
    PerformanceIndicatorStrategyComponent,
  ],
  exports: [PerformanceIndicatorStrategyComponent],
  imports: [
    CommonModule,
    PerformanceIndicatorRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class PerformanceIndicatorModule {}

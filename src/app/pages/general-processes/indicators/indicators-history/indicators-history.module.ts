import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CaptureFilterComponent } from '../components/capture-filter/capture-filter.component';
import { IndicatorsHistoryRoutingModule } from './indicators-history-routing.module';
import { IndicatorsHistoryComponent } from './indicators-history/indicators-history.component';

@NgModule({
  declarations: [IndicatorsHistoryComponent],
  imports: [
    CommonModule,
    IndicatorsHistoryRoutingModule,
    SharedModule,
    CaptureFilterComponent,
  ],
})
export class IndicatorsHistoryModule {}

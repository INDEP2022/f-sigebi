import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpCaptureFilterComponent } from '../components/gp-capture-filter/gp-capture-filter.component';
import { GpIIndicatorsHistoryRoutingModule } from './gp-i-indicators-history-routing.module';
import { GpIIndicatorsHistoryComponent } from './gp-i-indicators-history/gp-i-indicators-history.component';

@NgModule({
  declarations: [GpIIndicatorsHistoryComponent],
  imports: [
    CommonModule,
    GpIIndicatorsHistoryRoutingModule,
    SharedModule,
    GpCaptureFilterComponent,
  ],
})
export class GpIIndicatorsHistoryModule {}

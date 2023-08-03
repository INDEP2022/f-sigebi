import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CaptureFilterComponent } from '../components/capture-filter/capture-filter.component';
import { CaptureFilterHistoryIndicatorsComponent } from './components/capture-filter-history-indicators/capture-filter-history-indicators.component';
import { EventEmitterTwoComponent } from './components/event-emitter-two/event-emitter-two.component';
import { EventEmmiterComponent } from './components/event-emmiter/event-emmiter.component';
import { IndicatorsHistoryDetailComponent } from './components/indicators-history-detail/indicators-history-detail.component';
import { IndicatorsHistoryServiceOrdersComponent } from './components/indicators-history-service-orders/indicators-history-service-orders.component';
import { CardHistoryTechnicalComponent } from './components/indicators-history-technical-datasheet/card/card-history-technical/card-history-technical.component';
import { IndicatorsHistoryTechnicalDatasheetComponent } from './components/indicators-history-technical-datasheet/indicators-history-technical-datasheet.component';
import { IndicatorsHistoryRoutingModule } from './indicators-history-routing.module';
import { IndicatorsHistoryComponent } from './indicators-history/indicators-history.component';

@NgModule({
  declarations: [
    IndicatorsHistoryComponent,
    CaptureFilterHistoryIndicatorsComponent,
    IndicatorsHistoryDetailComponent,
    IndicatorsHistoryTechnicalDatasheetComponent,
    IndicatorsHistoryServiceOrdersComponent,
    CardHistoryTechnicalComponent,
    EventEmmiterComponent,
    EventEmitterTwoComponent,
  ],
  imports: [
    CommonModule,
    IndicatorsHistoryRoutingModule,
    SharedModule,
    CaptureFilterComponent,
  ],
})
export class IndicatorsHistoryModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CaptureFilterComponent } from '../components/capture-filter/capture-filter.component';
import { ReceptionStrategiesRoutingModule } from './reception-strategies-routing.module';
import { ReceptionStrategiesComponent } from './reception-strategies/reception-strategies.component';

@NgModule({
  declarations: [ReceptionStrategiesComponent],
  imports: [
    CommonModule,
    ReceptionStrategiesRoutingModule,
    SharedModule,
    CaptureFilterComponent,
  ],
})
export class ReceptionStrategiesModule {}

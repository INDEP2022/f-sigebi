import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GpCaptureFilterComponent } from '../components/gp-capture-filter/gp-capture-filter.component';
import { GpIReceptionStrategiesRoutingModule } from './gp-i-reception-strategies-routing.module';
import { GpIReceptionStrategiesComponent } from './gp-i-reception-strategies/gp-i-reception-strategies.component';

@NgModule({
  declarations: [GpIReceptionStrategiesComponent],
  imports: [
    CommonModule,
    GpIReceptionStrategiesRoutingModule,
    SharedModule,
    GpCaptureFilterComponent,
  ],
})
export class GpIReceptionStrategiesModule {}

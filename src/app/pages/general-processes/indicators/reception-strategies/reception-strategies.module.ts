import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CaptureFilterDictComponent } from '../components/capture-filter-dict/capture-filter-dict.component';
import { ReceptionStrategiesRoutingModule } from './reception-strategies-routing.module';
import { ReceptionStrategiesComponent } from './reception-strategies/reception-strategies.component';

@NgModule({
  declarations: [ReceptionStrategiesComponent],
  imports: [
    CommonModule,
    ReceptionStrategiesRoutingModule,
    SharedModule,
    CaptureFilterDictComponent,
  ],
})
export class ReceptionStrategiesModule {}

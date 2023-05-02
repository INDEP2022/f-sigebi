import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { MeasurementUnitsRoutingModule } from './measurement-units-routing.module';
import { MeasurementUnitsComponent } from './measurement-units/measurement-units.component';

@NgModule({
  declarations: [MeasurementUnitsComponent],
  imports: [CommonModule, MeasurementUnitsRoutingModule, SharedModule],
})
export class MeasurementUnitsModule {}

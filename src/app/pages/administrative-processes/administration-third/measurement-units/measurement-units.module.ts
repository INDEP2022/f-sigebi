import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeasurementUnitsRoutingModule } from './measurement-units-routing.module';
import { MeasurementUnitsComponent } from './measurement-units/measurement-units.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    MeasurementUnitsComponent
  ],
  imports: [
    CommonModule,
    MeasurementUnitsRoutingModule,
    SharedModule
  ]
})
export class MeasurementUnitsModule { }

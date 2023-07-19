import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MeasuremenUnitsModalComponent } from './measuremen-units-modal/measuremen-units-modal.component';
import { MeasurementUnitsRoutingModule } from './measurement-units-routing.module';
import { MeasurementUnitsComponent } from './measurement-units/measurement-units.component';

@NgModule({
  declarations: [MeasurementUnitsComponent, MeasuremenUnitsModalComponent],
  imports: [
    CommonModule,
    MeasurementUnitsRoutingModule,
    DelegationSharedComponent,
    SharedModule,
  ],
})
export class MeasurementUnitsModule {}

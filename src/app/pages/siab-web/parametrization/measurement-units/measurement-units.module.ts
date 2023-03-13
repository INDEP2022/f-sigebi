import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { MeasurementUnitsFormComponent } from './measurement-units-form/measurement-units-form.component';
import { MeasurementUnitsListComponent } from './measurement-units-list/measurement-units-list.component';
import { MeasurementUnitsRoutingModule } from './measurement-units-routing.module';

@NgModule({
  declarations: [MeasurementUnitsListComponent, MeasurementUnitsFormComponent],
  imports: [
    CommonModule,
    MeasurementUnitsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class MeasurementUnitsModule {}

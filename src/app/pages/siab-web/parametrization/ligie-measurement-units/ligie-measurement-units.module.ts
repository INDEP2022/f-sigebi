import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { LigieMeasurementUnitsFormComponent } from './ligie-measurement-units-form/ligie-measurement-units-form.component';
import { LigieMeasurementUnitsListComponent } from './ligie-measurement-units-list/ligie-measurement-units-list.component';
import { LigieMeasurementUnitsRoutingModule } from './ligie-measurement-units-routing.module';

@NgModule({
  declarations: [
    LigieMeasurementUnitsListComponent,
    LigieMeasurementUnitsFormComponent,
  ],
  imports: [
    CommonModule,
    LigieMeasurementUnitsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class LigieMeasurementUnitsModule {}

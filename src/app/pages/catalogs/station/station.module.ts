import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { StationFormComponent } from './station-form/station-form.component';
import { StationListComponent } from './station-list/station-list.component';
import { StationRoutingModule } from './station-routing.module';

@NgModule({
  declarations: [StationListComponent, StationFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    StationRoutingModule,
  ],
})
export class StationModule {}

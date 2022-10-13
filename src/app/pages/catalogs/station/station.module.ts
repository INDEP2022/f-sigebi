import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StationRoutingModule } from './station-routing.module';
import { StationListComponent } from './station-list/station-list.component';
import { StationFormComponent } from './station-form/station-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    StationListComponent,
    StationFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    StationRoutingModule
  ]
})
export class StationModule { }

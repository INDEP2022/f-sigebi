import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { FinalDestinationProcessRoutingModule } from './final-destination-process-routing.module';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FinalDestinationProcessRoutingModule,
    TimepickerModule.forRoot(),
    ModalModule.forChild(),
  ],
})
export class FinalDestinationProcessModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinalDestinationProcessRoutingModule } from './final-destination-process-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FinalDestinationProcessRoutingModule,
    TimepickerModule.forRoot(),
    ModalModule.forChild()
  ]
})
export class FinalDestinationProcessModule {}

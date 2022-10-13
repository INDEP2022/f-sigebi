import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinalDestinationProcessRoutingModule } from './final-destination-process-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FinalDestinationProcessRoutingModule,
    ModalModule.forChild()
  ]
})
export class FinalDestinationProcessModule { }

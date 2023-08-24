import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ConsultationRoutingModule } from './consultation-routing.module';
//import { ConsultationOfRecordsComponent } from './consultation-of-records/consultation-of-records/consultation-of-records.component';
//import { ConsultationRealStateComponent } from './consultation-real-state/consultation-real-state/consultation-real-state.component';

@NgModule({
  declarations: [
    /*ConsultationOfRecordsComponent,
    ConsultationRealStateComponent*/
  ],
  imports: [CommonModule, ConsultationRoutingModule],
})
export class ConsultationModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ConsultationOfRecordsRoutingModule } from './consultation-of-records-routing.module';
import { ConsultationOfRecordsComponent } from './consultation-of-records/consultation-of-records.component';

@NgModule({
  declarations: [ConsultationOfRecordsComponent],
  imports: [CommonModule, ConsultationOfRecordsRoutingModule, SharedModule],
})
export class ConsultationOfRecordsModule {}

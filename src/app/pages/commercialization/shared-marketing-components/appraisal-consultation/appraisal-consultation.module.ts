import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExcelService } from 'src/app/common/services/excel.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { AppraisalConsultationRoutingModule } from './appraisal-consultation-routing.module';
import { AppraisalConsultationComponent } from './appraisal-consultation/appraisal-consultation.component';

@NgModule({
  declarations: [AppraisalConsultationComponent],
  imports: [CommonModule, AppraisalConsultationRoutingModule, SharedModule],
  providers: [ExcelService],
})
export class AppraisalConsultationModule {}

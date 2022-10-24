import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExcelService } from 'src/app/common/services/excel.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { CBACdaCAppraisalConsultationComponent } from './c-b-a-cda-c-appraisal-consultation/c-b-a-cda-c-appraisal-consultation.component';
import { CBACdaMAppraisalConsultationRoutingModule } from './c-b-a-cda-m-appraisal-consultation-routing.module';

@NgModule({
  declarations: [CBACdaCAppraisalConsultationComponent],
  imports: [
    CommonModule,
    CBACdaMAppraisalConsultationRoutingModule,
    SharedModule,
  ],
  providers: [ExcelService],
})
export class CBACdaMAppraisalConsultationModule {}

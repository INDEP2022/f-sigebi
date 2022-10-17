import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { ExcelService } from 'src/app/common/services/exporttoexcel.service';

import { CBACdaMAppraisalConsultationRoutingModule } from './c-b-a-cda-m-appraisal-consultation-routing.module';
import { CBACdaCAppraisalConsultationComponent } from './c-b-a-cda-c-appraisal-consultation/c-b-a-cda-c-appraisal-consultation.component';

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

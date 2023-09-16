import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExcelService } from 'src/app/common/services/excel.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AppraisalConsultationRoutingModule } from './appraisal-consultation-routing.module';
import { AppraisalConsultationComponent } from './appraisal-consultation/appraisal-consultation.component';
import { AppraisalConsultationFormComponent } from './components/appraisal-consultation-form/appraisal-consultation-form.component';
import { AppraisalConsultationListComponent } from './components/appraisal-consultation-list/appraisal-consultation-list.component';

@NgModule({
  declarations: [
    AppraisalConsultationComponent,
    AppraisalConsultationFormComponent,
    AppraisalConsultationListComponent,
  ],
  imports: [
    CommonModule,
    AppraisalConsultationRoutingModule,
    SharedModule,
    TooltipModule,
  ],
  providers: [ExcelService],
})
export class AppraisalConsultationModule {}

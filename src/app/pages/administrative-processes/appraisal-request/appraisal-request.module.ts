import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../shared/shared.module';
import { AppraisalRequestDetailComponent } from './appraisal-request-detail/appraisal-request-detail.component';
import { AppraisalRequestRoutingModule } from './appraisal-request-routing.module';
import { AppraisalRequestComponent } from './appraisal-request.component';

@NgModule({
  declarations: [AppraisalRequestComponent, AppraisalRequestDetailComponent],
  imports: [
    CommonModule,
    AppraisalRequestRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class AppraisalRequestModule {}

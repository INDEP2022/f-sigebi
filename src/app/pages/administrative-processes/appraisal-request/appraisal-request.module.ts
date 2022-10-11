import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppraisalRequestRoutingModule } from './appraisal-request-routing.module';
import { AppraisalRequestComponent } from './appraisal-request.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [
    AppraisalRequestComponent
  ],
  imports: [
    CommonModule,
    AppraisalRequestRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class AppraisalRequestModule { }

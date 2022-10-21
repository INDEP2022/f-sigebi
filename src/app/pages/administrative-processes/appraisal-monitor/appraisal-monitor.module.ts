import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppraisalMonitorRoutingModule } from './appraisal-monitor-routing.module';
import { AppraisalMonitorComponent } from './appraisal-monitor/appraisal-monitor.component';

@NgModule({
  declarations: [AppraisalMonitorComponent],
  imports: [
    CommonModule,
    AppraisalMonitorRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class AppraisalMonitorModule {}

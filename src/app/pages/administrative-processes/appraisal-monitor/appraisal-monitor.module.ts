import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppraisalMonitorRoutingModule } from './appraisal-monitor-routing.module';
import { AppraisalMonitorComponent } from './appraisal-monitor/appraisal-monitor.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

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

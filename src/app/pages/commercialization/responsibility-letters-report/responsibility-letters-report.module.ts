import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResponsibilityLettersReportRoutingModule } from './responsibility-letters-report-routing.module';
import { ResponsibilityLettersReportComponent } from './responsibility-letters-report.component';

@NgModule({
  declarations: [ResponsibilityLettersReportComponent],
  imports: [
    CommonModule,
    ResponsibilityLettersReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class ResponsibilityLettersReportModule {}

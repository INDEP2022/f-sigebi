import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { CMResponsibilityLettersReportRoutingModule } from './c-m-responsibility-letters-report-routing.module';
import { CMResponsibilityLettersReportComponent } from './c-m-responsibility-letters-report.component';

@NgModule({
  declarations: [CMResponsibilityLettersReportComponent],
  imports: [
    CommonModule,
    CMResponsibilityLettersReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class CMResponsibilityLettersReportModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { CMReleaseLetterReportRoutingModule } from './c-m-release-letter-report-routing.module';
import { CMReleaseLetterReportComponent } from './c-m-release-letter-report.component';

@NgModule({
  declarations: [CMReleaseLetterReportComponent],
  imports: [
    CommonModule,
    CMReleaseLetterReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class CMReleaseLetterReportModule {}

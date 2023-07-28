import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { FindReleaseLetterComponent } from './find-release-letter/find-release-letter.component';
import { ReleaseLetterReportRoutingModule } from './release-letter-report-routing.module';
import { ReleaseLetterReportComponent } from './release-letter-report.component';

@NgModule({
  declarations: [ReleaseLetterReportComponent, FindReleaseLetterComponent],
  imports: [
    CommonModule,
    ReleaseLetterReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class ReleaseLetterReportModule {}

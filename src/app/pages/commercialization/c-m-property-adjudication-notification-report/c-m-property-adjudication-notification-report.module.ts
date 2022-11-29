import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { CMPropertyAdjudicationNotificationReportRoutingModule } from './c-m-property-adjudication-notification-report-routing.module';
import { CMPropertyAdjudicationNotificationReportComponent } from './c-m-property-adjudication-notification-report.component';

@NgModule({
  declarations: [CMPropertyAdjudicationNotificationReportComponent],
  imports: [
    CommonModule,
    CMPropertyAdjudicationNotificationReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class CMPropertyAdjudicationNotificationReportModule {}

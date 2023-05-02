import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { PropertyAdjudicationNotificationReportRoutingModule } from './property-adjudication-notification-report-routing.module';
import { PropertyAdjudicationNotificationReportComponent } from './property-adjudication-notification-report.component';

@NgModule({
  declarations: [PropertyAdjudicationNotificationReportComponent],
  imports: [
    CommonModule,
    PropertyAdjudicationNotificationReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class PropertyAdjudicationNotificationReportModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CMPropertyAdjudicationNotificationReportComponent } from './c-m-property-adjudication-notification-report.component';

const routes: Routes = [
  { path: '', component: CMPropertyAdjudicationNotificationReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CMPropertyAdjudicationNotificationReportRoutingModule {}

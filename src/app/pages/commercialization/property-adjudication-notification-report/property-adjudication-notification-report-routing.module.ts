import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyAdjudicationNotificationReportComponent } from './property-adjudication-notification-report.component';

const routes: Routes = [
  { path: '', component: PropertyAdjudicationNotificationReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyAdjudicationNotificationReportRoutingModule {}

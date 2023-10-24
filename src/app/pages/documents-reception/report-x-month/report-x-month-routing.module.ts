import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportXMonthComponent } from './report-x-month/report-x-month.component';
//import { PrintFlyersComponent } from './print-flyers/print-flyers.component';

const routes: Routes = [{ path: '', component: ReportXMonthComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportXMonthRoutingModule {}

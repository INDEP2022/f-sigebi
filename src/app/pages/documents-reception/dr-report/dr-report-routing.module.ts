import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrReportComponent } from './dr-report/dr-report.component';

const routes: Routes = [
  {
    path: '',
    component: DrReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrReportRoutingModule {}

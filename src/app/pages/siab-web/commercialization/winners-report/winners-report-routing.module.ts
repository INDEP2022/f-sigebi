import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { winnersReportComponent } from './winners-report/winners-report.component';

const routes: Routes = [
  {
    path: '',
    component: winnersReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class winnersReportRoutingModule {}

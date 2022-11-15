import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImplementationReportComponent } from './implementation-report/implementation-report.component';

const routes: Routes = [
  {
    path: '',
    component: ImplementationReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImplementationReportRoutingModule {}

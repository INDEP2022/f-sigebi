import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpTreeReportComponent } from './gp-tree-report/gp-tree-report.component';

const routes: Routes = [
  {
    path: '',
    component: GpTreeReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpTreeReportRoutingModule {}

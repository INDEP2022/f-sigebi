import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreeReportComponent } from './tree-report/tree-report.component';

const routes: Routes = [
  {
    path: '',
    component: TreeReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TreeReportRoutingModule {}

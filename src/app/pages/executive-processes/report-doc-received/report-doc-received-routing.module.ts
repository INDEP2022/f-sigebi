import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportDocReceivedComponent } from './report-doc-received/report-doc-received.component';

const routes: Routes = [
  {
    path: '',
    component: ReportDocReceivedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportDocReceivedRoutingModule {}

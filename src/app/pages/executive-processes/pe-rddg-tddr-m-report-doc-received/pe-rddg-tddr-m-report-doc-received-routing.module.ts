import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeRddgTddrCReportDocReceivedComponent } from './pe-rddg-tddr-c-report-doc-received/pe-rddg-tddr-c-report-doc-received.component';

const routes: Routes = [
  {
    path: '',
    component: PeRddgTddrCReportDocReceivedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeRddgTddrMReportDocReceivedRoutingModule {}

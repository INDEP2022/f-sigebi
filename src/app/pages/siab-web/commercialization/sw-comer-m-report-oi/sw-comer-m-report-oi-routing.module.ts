import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwComerCReportOiComponent } from './sw-comer-c-report-oi/sw-comer-c-report-oi.component';

const routes: Routes = [
  {
    path: '',
    component: SwComerCReportOiComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwComerMReportOiRoutingModule {}

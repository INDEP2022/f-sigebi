import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialInformationReportComponent } from './financial-information-report/financial-information-report.component';

const routes: Routes = [
  {
    path: '',
    component: FinancialInformationReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialInformationReportRoutingModule {}

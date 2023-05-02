import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { MandateIncomeReportsComponent } from './mandate-income-reports/mandate-income-reports.component';

const routes: Routes = [
  {
    path: '',
    component: MandateIncomeReportsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MandateIncomeReportsRoutingModule {}

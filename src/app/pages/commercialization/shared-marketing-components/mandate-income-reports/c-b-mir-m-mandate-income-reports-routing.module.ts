import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { CBMirCMandateIncomeReportsComponent } from './mandate-income-reports/c-b-mir-c-mandate-income-reports.component';

const routes: Routes = [
  {
    path: '',
    component: CBMirCMandateIncomeReportsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBMirMMandateIncomeReportsRoutingModule {}

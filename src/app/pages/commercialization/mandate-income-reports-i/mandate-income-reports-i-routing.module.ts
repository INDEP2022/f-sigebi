import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MandateIncomeReportsIComponent } from './mandate-income-reports-i/mandate-income-reports-i.component';

const routes: Routes = [
  {
    path: '',
    component: MandateIncomeReportsIComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MandateIncomeReportsIRoutingModule {}

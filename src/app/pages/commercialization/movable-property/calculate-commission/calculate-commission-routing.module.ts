import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculateCommissionComponent } from './calculate-commission/calculate-commission.component';

const routes: Routes = [
  {
    path: '',
    component: CalculateCommissionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalculateCommissionRoutingModule {}

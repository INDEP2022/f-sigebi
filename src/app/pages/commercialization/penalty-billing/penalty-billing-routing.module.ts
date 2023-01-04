import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PenaltyBillingMainComponent } from './penalty-billing-main/penalty-billing-main.component';

const routes: Routes = [
  {
    path: ':type',
    component: PenaltyBillingMainComponent,
    data: { screen: 'FCOMER089' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PenaltyBillingRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CFpCPenaltyBillingMainComponent } from './c-fp-c-penalty-billing-main/c-fp-c-penalty-billing-main.component';

const routes: Routes = [
  {
    path: ':type',
    component: CFpCPenaltyBillingMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CFpMPenaltyBillingRoutingModule {}

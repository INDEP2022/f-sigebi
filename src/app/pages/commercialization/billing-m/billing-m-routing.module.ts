import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingScreenComponent } from './billing-screen/billing-screen.component';

const routes: Routes = [
  {
    path: ':type',
    component: BillingScreenComponent,
    data: { screen: 'FCOMER086_I' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingMRoutingModule {}

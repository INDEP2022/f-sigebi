import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegularBillingTabComponent } from './regular-billing-tab/regular-billing-tab.component';

const routes: Routes = [
  {
    path: '',
    component: RegularBillingTabComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegularBillingTabRoutingModule {}

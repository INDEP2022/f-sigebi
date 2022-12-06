import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectDonationInventoryComponent } from './website-donation-proposal/direct-donation-inventory.component';

const routes: Routes = [
  {
    path: '',
    component: DirectDonationInventoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirectDonationInventoryRoutingModule {}

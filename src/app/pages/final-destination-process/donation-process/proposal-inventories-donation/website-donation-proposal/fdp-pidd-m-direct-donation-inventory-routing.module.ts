import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpPiddCDirectDonationInventoryComponent } from './website-donation-proposal/fdp-pidd-c-direct-donation-inventory.component';

const routes: Routes = [
  {
    path: '',
    component: FdpPiddCDirectDonationInventoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpPiddMDirectDonationInventoryRoutingModule {}

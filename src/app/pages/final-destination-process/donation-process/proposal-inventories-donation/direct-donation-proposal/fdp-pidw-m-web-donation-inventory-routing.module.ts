import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpPidwCWebDonationInventoryComponent } from './direct-donation-proposal/fdp-pidw-c-web-donation-inventory.component';

const routes: Routes = [
  {
    path: '',
    component: FdpPidwCWebDonationInventoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpPidwMWebDonationInventoryRoutingModule {}

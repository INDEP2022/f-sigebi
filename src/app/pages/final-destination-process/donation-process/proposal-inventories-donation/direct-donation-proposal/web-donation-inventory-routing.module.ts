import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebDonationInventoryComponent } from './direct-donation-proposal/web-donation-inventory.component';

const routes: Routes = [
  {
    path: '',
    component: WebDonationInventoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebDonationInventoryRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpRiddCRegistrationInventoriesDonationComponent } from './registration-inventories-donation/fdp-ridd-c-registration-inventories-donation.component';

const routes: Routes = [
  {
    path: '',
    component: FdpRiddCRegistrationInventoriesDonationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpRiddMRegistrationInventoriesDonationRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationInventoriesDonationComponent } from './registration-inventories-donation/registration-inventories-donation.component';

const routes: Routes = [
  {
    path: '',
    component: RegistrationInventoriesDonationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationInventoriesDonationRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministratorDonationContractComponent } from './administrator-donation-contract/administrator-donation-contract.component';

const routes: Routes = [
  {
    path: '',
    component: AdministratorDonationContractComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministratorDonationContractRoutingModule {}

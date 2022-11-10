import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpCddaCAdministratorDonationContractComponent } from './administrator-donation-contract/fdp-cdda-c-administrator-donation-contract.component';

const routes: Routes = [
  {
    path: '',
    component: FdpCddaCAdministratorDonationContractComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpCddaMAdministratorDonationContractRoutingModule {}

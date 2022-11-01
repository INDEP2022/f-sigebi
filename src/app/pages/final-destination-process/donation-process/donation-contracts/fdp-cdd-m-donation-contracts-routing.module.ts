import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpCddCDonationContractsComponent } from './donation-contracts/fdp-cdd-c-donation-contracts.component';

const routes: Routes = [
  {
    path: '',
    component: FdpCddCDonationContractsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpCddMDonationContractsRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonationContractsComponent } from './donation-contracts/donation-contracts.component';

const routes: Routes = [
  {
    path: '',
    component: DonationContractsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationContractsRoutingModule {}

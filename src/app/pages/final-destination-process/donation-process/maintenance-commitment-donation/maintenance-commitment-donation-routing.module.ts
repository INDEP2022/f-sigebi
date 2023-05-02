import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceCommitmentDonationComponent } from './maintenance-commitment-donation/maintenance-commitment-donation.component';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceCommitmentDonationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceCommitmentDonationRoutingModule {}

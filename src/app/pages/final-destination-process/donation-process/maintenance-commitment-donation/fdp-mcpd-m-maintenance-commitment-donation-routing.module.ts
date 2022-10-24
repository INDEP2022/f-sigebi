import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpMcpdCMaintenanceCommitmentDonationComponent } from './maintenance-commitment-donation/fdp-mcpd-c-maintenance-commitment-donation.component';

const routes: Routes = [
  {
    path: '',
    component: FdpMcpdCMaintenanceCommitmentDonationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpMcpdMMaintenanceCommitmentDonationRoutingModule {}

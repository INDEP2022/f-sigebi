import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpDitCDataTableComponent } from './data-in-table/fdp-dit-c-data-table.component';
import { FdpMcpdMMaintenanceCommitmentDonationRoutingModule } from './fdp-mcpd-m-maintenance-commitment-donation-routing.module';
import { FdpMcpdCMaintenanceCommitmentDonationComponent } from './maintenance-commitment-donation/fdp-mcpd-c-maintenance-commitment-donation.component';

@NgModule({
  declarations: [
    FdpMcpdCMaintenanceCommitmentDonationComponent,
    FdpDitCDataTableComponent,
  ],
  imports: [
    CommonModule,
    FdpMcpdMMaintenanceCommitmentDonationRoutingModule,
    SharedModule,
    TabsModule,
  ],
})
export class FdpMcpdMMaintenanceCommitmentDonationModule {}

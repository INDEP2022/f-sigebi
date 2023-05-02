import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataTableComponent } from './data-in-table/data-table.component';
import { MaintenanceCommitmentDonationRoutingModule } from './maintenance-commitment-donation-routing.module';
import { MaintenanceCommitmentDonationComponent } from './maintenance-commitment-donation/maintenance-commitment-donation.component';

@NgModule({
  declarations: [MaintenanceCommitmentDonationComponent, DataTableComponent],
  imports: [
    CommonModule,
    MaintenanceCommitmentDonationRoutingModule,
    SharedModule,
    TabsModule,
  ],
})
export class MaintenanceCommitmentDonationModule {}

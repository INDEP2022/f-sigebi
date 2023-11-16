import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxCurrencyModule } from 'ngx-currency';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataTableComponent } from './data-in-table/data-table.component';
import { MaintenanceCommitmentDonationModalComponent } from './maintenance-commitment-donation-modal/maintenance-commitment-donation-modal.component';
import { MaintenanceCommitmentDonationRoutingModule } from './maintenance-commitment-donation-routing.module';
import { MaintenanceCommitmentDonationComponent } from './maintenance-commitment-donation/maintenance-commitment-donation.component';
export const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  allowZero: true,
  decimal: '.',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: ',',
  nullable: false,
};
@NgModule({
  declarations: [
    MaintenanceCommitmentDonationComponent,
    DataTableComponent,
    MaintenanceCommitmentDonationModalComponent,
  ],
  imports: [
    CommonModule,
    MaintenanceCommitmentDonationRoutingModule,
    SharedModule,
    TabsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
})
export class MaintenanceCommitmentDonationModule {}

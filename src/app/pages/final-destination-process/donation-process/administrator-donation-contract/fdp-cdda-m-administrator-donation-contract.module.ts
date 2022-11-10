import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedFinalDestinationModule } from '../../shared-final-destination/shared-final-destination.module';
import { FdpCddaCAdministratorDonationContractComponent } from './administrator-donation-contract/fdp-cdda-c-administrator-donation-contract.component';
import { FdpCddaMAdministratorDonationContractRoutingModule } from './fdp-cdda-m-administrator-donation-contract-routing.module';

@NgModule({
  declarations: [FdpCddaCAdministratorDonationContractComponent],
  imports: [
    CommonModule,
    FdpCddaMAdministratorDonationContractRoutingModule,
    SharedFinalDestinationModule,
  ],
})
export class FdpCddaMAdministratorDonationContractModule {}

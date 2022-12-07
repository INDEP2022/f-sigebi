import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedFinalDestinationModule } from '../../shared-final-destination/shared-final-destination.module';
import { AdministratorDonationContractRoutingModule } from './administrator-donation-contract-routing.module';
import { AdministratorDonationContractComponent } from './administrator-donation-contract/administrator-donation-contract.component';

@NgModule({
  declarations: [AdministratorDonationContractComponent],
  imports: [
    CommonModule,
    AdministratorDonationContractRoutingModule,
    SharedFinalDestinationModule,
  ],
})
export class AdministratorDonationContractModule {}

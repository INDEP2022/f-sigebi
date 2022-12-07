import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedFinalDestinationModule } from '../../shared-final-destination/shared-final-destination.module';
import { DonationContractsRoutingModule } from './donation-contracts-routing.module';
import { DonationContractsComponent } from './donation-contracts/donation-contracts.component';

@NgModule({
  declarations: [DonationContractsComponent],
  imports: [
    CommonModule,
    DonationContractsRoutingModule,
    SharedModule,
    NgScrollbarModule,
    SharedFinalDestinationModule,
  ],
})
export class DonationContractsModule {}

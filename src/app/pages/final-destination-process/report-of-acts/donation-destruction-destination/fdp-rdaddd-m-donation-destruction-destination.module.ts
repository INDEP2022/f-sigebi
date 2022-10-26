import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedFinalDestinationModule } from '../../shared-final-destination/shared-final-destination.module';
import { FdpRdadddCDonationDestructionDestinationComponent } from './donation-destruction-destination/fdp-rdaddd-c-donation-destruction-destination.component';
import { FdpRdadddMDonationDestructionDestinationRoutingModule } from './fdp-rdaddd-m-donation-destruction-destination-routing.module';

@NgModule({
  declarations: [FdpRdadddCDonationDestructionDestinationComponent],
  imports: [
    CommonModule,
    FdpRdadddMDonationDestructionDestinationRoutingModule,
    SharedModule,
    FormsModule,
    SharedFinalDestinationModule,
  ],
})
export class FdpRdadddMDonationDestructionDestinationModule {}

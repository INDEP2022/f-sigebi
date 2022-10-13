import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FdpRdadddMDonationDestructionDestinationRoutingModule } from './fdp-rdaddd-m-donation-destruction-destination-routing.module';
import { FdpRdadddCDonationDestructionDestinationComponent } from './donation-destruction-destination/fdp-rdaddd-c-donation-destruction-destination.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FdpRdadddCDonationDestructionDestinationComponent
  ],
  imports: [
    CommonModule,
    FdpRdadddMDonationDestructionDestinationRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class FdpRdadddMDonationDestructionDestinationModule { }

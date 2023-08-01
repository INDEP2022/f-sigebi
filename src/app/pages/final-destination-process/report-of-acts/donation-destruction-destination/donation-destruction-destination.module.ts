import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedFinalDestinationModule } from '../../shared-final-destination/shared-final-destination.module';
import { DonationDestructionDestinationRoutingModule } from './donation-destruction-destination-routing.module';
import { DonationDestructionDestinationComponent } from './donation-destruction-destination/donation-destruction-destination.component';

@NgModule({
  declarations: [DonationDestructionDestinationComponent],
  imports: [
    CommonModule,
    DonationDestructionDestinationRoutingModule,
    SharedModule,
    FormsModule,
    SharedFinalDestinationModule,
    DelegationSharedComponent,
  ],
})
export class DonationDestructionDestinationModule {}

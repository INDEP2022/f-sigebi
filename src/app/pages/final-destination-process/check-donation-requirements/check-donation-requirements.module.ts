import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedFinalDestinationModule } from '../shared-final-destination/shared-final-destination.module';
import { CheckDonationRequirementsRoutingModule } from './check-donation-requirements-routing.module';
import { CheckDonationRequirementsComponent } from './check-donation-requirements/check-donation-requirements.component';

@NgModule({
  declarations: [CheckDonationRequirementsComponent],
  imports: [
    CommonModule,
    CheckDonationRequirementsRoutingModule,
    SharedFinalDestinationModule,
    SharedModule,
    FormsModule,
  ],
})
export class CheckDonationRequirementsModule {}

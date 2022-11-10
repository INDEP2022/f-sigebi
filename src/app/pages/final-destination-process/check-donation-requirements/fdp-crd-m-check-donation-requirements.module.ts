import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedFinalDestinationModule } from '../shared-final-destination/shared-final-destination.module';
import { FdpCrdCCheckDonationRequirementsComponent } from './check-donation-requirements/fdp-crd-c-check-donation-requirements.component';
import { FdpCrdMCheckDonationRequirementsRoutingModule } from './fdp-crd-m-check-donation-requirements-routing.module';

@NgModule({
  declarations: [FdpCrdCCheckDonationRequirementsComponent],
  imports: [
    CommonModule,
    FdpCrdMCheckDonationRequirementsRoutingModule,
    SharedFinalDestinationModule,
    SharedModule,
    FormsModule,
  ],
})
export class FdpCrdMCheckDonationRequirementsModule {}

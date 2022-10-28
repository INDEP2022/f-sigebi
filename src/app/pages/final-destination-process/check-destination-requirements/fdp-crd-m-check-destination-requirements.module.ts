import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedFinalDestinationModule } from '../shared-final-destination/shared-final-destination.module';
import { FdpCrdCCheckDestinationRequirementsComponent } from './check-destination-requirements/fdp-crd-c-check-destination-requirements.component';
import { FdpCrdMCheckDestinationRequirementsRoutingModule } from './fdp-crd-m-check-destination-requirements-routing.module';

@NgModule({
  declarations: [FdpCrdCCheckDestinationRequirementsComponent],
  imports: [
    CommonModule,
    FdpCrdMCheckDestinationRequirementsRoutingModule,
    SharedFinalDestinationModule,
  ],
})
export class FdpCrdMCheckDestinationRequirementsModule {}

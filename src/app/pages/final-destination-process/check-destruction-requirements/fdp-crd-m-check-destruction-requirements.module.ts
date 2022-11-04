import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedFinalDestinationModule } from '../shared-final-destination/shared-final-destination.module';
import { FdpCrdCCheckDestructionRequirementsComponent } from './check-destruction-requirements/fdp-crd-c-check-destruction-requirements.component';
import { FdpCrdMCheckDestructionRequirementsRoutingModule } from './fdp-crd-m-check-destruction-requirements-routing.module';

@NgModule({
  declarations: [FdpCrdCCheckDestructionRequirementsComponent],
  imports: [
    CommonModule,
    FdpCrdMCheckDestructionRequirementsRoutingModule,
    SharedFinalDestinationModule,
  ],
})
export class FdpCrdMCheckDestructionRequirementsModule {}

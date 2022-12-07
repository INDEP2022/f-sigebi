import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedFinalDestinationModule } from '../shared-final-destination/shared-final-destination.module';
import { CheckDestinationRequirementsRoutingModule } from './check-destination-requirements-routing.module';
import { CheckDestinationRequirementsComponent } from './check-destination-requirements/check-destination-requirements.component';

@NgModule({
  declarations: [CheckDestinationRequirementsComponent],
  imports: [
    CommonModule,
    CheckDestinationRequirementsRoutingModule,
    SharedFinalDestinationModule,
  ],
})
export class CheckDestinationRequirementsModule {}

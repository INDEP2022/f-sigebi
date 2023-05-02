import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedFinalDestinationModule } from '../shared-final-destination/shared-final-destination.module';
import { CheckDestructionRequirementsRoutingModule } from './check-destruction-requirements-routing.module';
import { CheckDestructionRequirementsComponent } from './check-destruction-requirements/check-destruction-requirements.component';

@NgModule({
  declarations: [CheckDestructionRequirementsComponent],
  imports: [
    CommonModule,
    CheckDestructionRequirementsRoutingModule,
    SharedFinalDestinationModule,
  ],
})
export class CheckDestructionRequirementsModule {}

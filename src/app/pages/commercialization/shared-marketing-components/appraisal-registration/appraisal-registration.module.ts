import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { AppraisalRegistrationRoutingModule } from './appraisal-registration-routing.module';
import { AppraisalRegistrationComponent } from './appraisal-registration/appraisal-registration.component';

@NgModule({
  declarations: [AppraisalRegistrationComponent],
  imports: [CommonModule, AppraisalRegistrationRoutingModule, SharedModule],
})
export class AppraisalRegistrationModule {}

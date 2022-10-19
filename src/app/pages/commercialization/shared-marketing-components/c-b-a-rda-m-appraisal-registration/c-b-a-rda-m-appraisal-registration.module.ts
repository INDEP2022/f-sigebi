import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';

import { CBARdaMAppraisalRegistrationRoutingModule } from './c-b-a-rda-m-appraisal-registration-routing.module';
import { CBARdaCAppraisalRegistrationComponent } from './c-b-a-rda-c-appraisal-registration/c-b-a-rda-c-appraisal-registration.component';

@NgModule({
  declarations: [CBARdaCAppraisalRegistrationComponent],
  imports: [
    CommonModule,
    CBARdaMAppraisalRegistrationRoutingModule,
    SharedModule,
  ],
})
export class CBARdaMAppraisalRegistrationModule {}

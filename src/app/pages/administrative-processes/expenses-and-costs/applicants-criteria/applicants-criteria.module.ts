import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { ApplicantsCriteriaRoutingModule } from './applicants-criteria-routing.module';
import { ApplicantsCriteriaComponent } from './applicants-criteria/applicants-criteria.component';

@NgModule({
  declarations: [ApplicantsCriteriaComponent],
  imports: [
    CommonModule,
    ApplicantsCriteriaRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class ApplicantsCriteriaModule {}

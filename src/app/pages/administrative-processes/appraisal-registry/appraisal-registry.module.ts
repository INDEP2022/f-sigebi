import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { AppraisalRegistryRoutingModule } from './appraisal-registry-routing.module';
import { AppraisalRegistryComponent } from './appraisal-registry/appraisal-registry.component';

@NgModule({
  declarations: [AppraisalRegistryComponent],
  imports: [
    CommonModule,
    AppraisalRegistryRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class AppraisalRegistryModule {}

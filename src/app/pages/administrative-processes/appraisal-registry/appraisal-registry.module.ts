import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppraisalRegistryRoutingModule } from './appraisal-registry-routing.module';
import { AppraisalRegistryComponent } from './appraisal-registry/appraisal-registry.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppraisalRegistryComponent
  ],
  imports: [
    CommonModule,
    AppraisalRegistryRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AppraisalRegistryModule { }

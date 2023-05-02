import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { CostsResumeRoutingModule } from './costs-resume-routing.module';
import { CostsResumeComponent } from './costs-resume/costs-resume.component';

@NgModule({
  declarations: [CostsResumeComponent],
  imports: [
    CommonModule,
    CostsResumeRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class CostsResumeModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CostsResumeRoutingModule } from './costs-resume-routing.module';
import { CostsResumeComponent } from './costs-resume/costs-resume.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

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

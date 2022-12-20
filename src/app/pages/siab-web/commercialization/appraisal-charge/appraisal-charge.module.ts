import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { appraisalChargeRoutingModule } from './appraisal-charge-routing.module';
import { appraisalChargeComponent } from './appraisal-charge/appraisal-charge.component';

@NgModule({
  declarations: [appraisalChargeComponent],
  imports: [CommonModule, appraisalChargeRoutingModule, SharedModule],
})
export class appraisalChargeModule {}

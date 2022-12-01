import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { SwComerCAppraisalChargeComponent } from './sw-comer-c-appraisal-charge/sw-comer-c-appraisal-charge.component';
import { SwComerMAppraisalChargeRoutingModule } from './sw-comer-m-appraisal-charge-routing.module';

@NgModule({
  declarations: [SwComerCAppraisalChargeComponent],
  imports: [CommonModule, SwComerMAppraisalChargeRoutingModule, SharedModule],
})
export class SwComerMAppraisalChargeModule {}

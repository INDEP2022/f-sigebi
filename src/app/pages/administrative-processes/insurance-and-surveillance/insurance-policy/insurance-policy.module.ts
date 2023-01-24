import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { InsurancePolicyRoutingModule } from './insurance-policy-routing.module';
import { InsurancePolicyComponent } from './insurance-policy.component';

@NgModule({
  declarations: [InsurancePolicyComponent],
  imports: [
    CommonModule,
    InsurancePolicyRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class InsurancePolicyModule {}

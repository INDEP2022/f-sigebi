import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsurancePolicyRoutingModule } from './insurance-policy-routing.module';
import { InsurancePolicyComponent } from './insurance-policy.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

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

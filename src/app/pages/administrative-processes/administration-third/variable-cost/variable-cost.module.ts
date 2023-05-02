import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { VariableCostRoutingModule } from './variable-cost-routing.module';
import { VariableCostComponent } from './variable-cost/variable-cost.component';

@NgModule({
  declarations: [VariableCostComponent],
  imports: [CommonModule, VariableCostRoutingModule, SharedModule],
})
export class VariableCostModule {}

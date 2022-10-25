import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { UnitCostRoutingModule } from './unit-cost-routing.module';
import { UnitCostComponent } from './unit-cost/unit-cost.component';

@NgModule({
  declarations: [UnitCostComponent],
  imports: [CommonModule, UnitCostRoutingModule, SharedModule],
})
export class UnitCostModule {}

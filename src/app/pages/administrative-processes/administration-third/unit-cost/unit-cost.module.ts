import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { UnitCostFormComponent } from './unit-cost-form/unit-cost-form.component';
import { UnitCostRoutingModule } from './unit-cost-routing.module';
import { UnitCostComponent } from './unit-cost/unit-cost.component';

@NgModule({
  declarations: [UnitCostComponent, UnitCostFormComponent],
  imports: [CommonModule, UnitCostRoutingModule, SharedModule],
})
export class UnitCostModule {}

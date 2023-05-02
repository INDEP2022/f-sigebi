import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { UnitCostDetFormComponent } from './unit-cost-det-form/unit-cost-det-form.component';
import { UnitCostFormComponent } from './unit-cost-form/unit-cost-form.component';
import { UnitCostRoutingModule } from './unit-cost-routing.module';
import { UnitCostComponent } from './unit-cost/unit-cost.component';

@NgModule({
  declarations: [
    UnitCostComponent,
    UnitCostFormComponent,
    UnitCostDetFormComponent,
  ],
  imports: [CommonModule, UnitCostRoutingModule, SharedModule],
})
export class UnitCostModule {}

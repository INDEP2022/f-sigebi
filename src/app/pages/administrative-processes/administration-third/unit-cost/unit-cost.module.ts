import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitCostRoutingModule } from './unit-cost-routing.module';
import { UnitCostComponent } from './unit-cost/unit-cost.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    UnitCostComponent
  ],
  imports: [
    CommonModule,
    UnitCostRoutingModule,
    SharedModule,
  ]
})
export class UnitCostModule { }

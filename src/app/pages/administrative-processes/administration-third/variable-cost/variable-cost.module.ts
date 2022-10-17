import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VariableCostRoutingModule } from './variable-cost-routing.module';
import { VariableCostComponent } from './variable-cost/variable-cost.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    VariableCostComponent
  ],
  imports: [
    CommonModule,
    VariableCostRoutingModule,
    SharedModule
  ]
})
export class VariableCostModule { }

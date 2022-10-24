import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CostsProceduresRoutingModule } from './costs-procedures-routing.module';
import { CostsProceduresComponent } from './costs-procedures/costs-procedures.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CostsProceduresComponent],
  imports: [
    CommonModule,
    CostsProceduresRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class CostsProceduresModule {}

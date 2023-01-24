import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { CostsProceduresRoutingModule } from './costs-procedures-routing.module';
import { CostsProceduresComponent } from './costs-procedures/costs-procedures.component';

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

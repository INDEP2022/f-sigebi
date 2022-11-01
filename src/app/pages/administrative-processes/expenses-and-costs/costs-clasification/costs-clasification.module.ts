import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { CostsClasificationRoutingModule } from './costs-clasification-routing.module';
import { CostsClasificationComponent } from './costs-clasification/costs-clasification.component';

@NgModule({
  declarations: [CostsClasificationComponent],
  imports: [
    CommonModule,
    CostsClasificationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class CostsClasificationModule {}

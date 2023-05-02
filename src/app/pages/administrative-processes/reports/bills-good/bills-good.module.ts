import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { BillsGoodRoutingModule } from './bills-good-routing.module';
import { BillsGoodComponent } from './bills-good/bills-good.component';

@NgModule({
  declarations: [BillsGoodComponent],
  imports: [CommonModule, BillsGoodRoutingModule, SharedModule],
})
export class BillsGoodModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { resCancelValuationRoutingModule } from './res-cancel-valuation-routing.module';
import { resCancelValuationComponent } from './res-cancel-valuation/res-cancel-valuation.component';

@NgModule({
  declarations: [resCancelValuationComponent],
  imports: [CommonModule, resCancelValuationRoutingModule, SharedModule],
})
export class resCancelValuationModule {}

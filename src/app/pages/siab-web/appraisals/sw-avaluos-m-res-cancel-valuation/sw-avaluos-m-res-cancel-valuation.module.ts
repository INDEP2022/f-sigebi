import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { SwAvaluosCResCancelValuationComponent } from './sw-avaluos-c-res-cancel-valuation/sw-avaluos-c-res-cancel-valuation.component';
import { SwAvaluosMResCancelValuationRoutingModule } from './sw-avaluos-m-res-cancel-valuation-routing.module';

@NgModule({
  declarations: [SwAvaluosCResCancelValuationComponent],
  imports: [
    CommonModule,
    SwAvaluosMResCancelValuationRoutingModule,
    SharedModule,
  ],
})
export class SwAvaluosMResCancelValuationModule {}

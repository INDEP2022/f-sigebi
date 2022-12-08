import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { SwAvaluosCValuationRequestComponent } from './sw-avaluos-c-valuation-request/sw-avaluos-c-valuation-request.component';
import { SwAvaluosMValuationRequestRoutingModule } from './sw-avaluos-m-valuation-request-routing.module';

@NgModule({
  declarations: [SwAvaluosCValuationRequestComponent],
  imports: [
    CommonModule,
    SwAvaluosMValuationRequestRoutingModule,
    SharedModule,
  ],
})
export class SwAvaluosMValuationRequestModule {}

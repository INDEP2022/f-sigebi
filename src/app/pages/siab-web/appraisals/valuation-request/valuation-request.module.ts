import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { valuationRequestRoutingModule } from './valuation-request-routing.module';
import { valuationRequestComponent } from './valuation-request/valuation-request.component';

@NgModule({
  declarations: [valuationRequestComponent],
  imports: [CommonModule, valuationRequestRoutingModule, SharedModule],
})
export class valuationRequestModule {}

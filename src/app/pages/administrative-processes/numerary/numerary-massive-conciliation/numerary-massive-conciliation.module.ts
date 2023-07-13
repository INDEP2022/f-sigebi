import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NumeraryMassiveConciliationRoutingModule } from './numerary-massive-conciliation-routing.module';
import { NumeraryMassiveConciliationComponent } from './numerary-massive-conciliation/numerary-massive-conciliation.component';

@NgModule({
  declarations: [NumeraryMassiveConciliationComponent],
  imports: [CommonModule, NumeraryMassiveConciliationRoutingModule],
})
export class NumeraryMassiveConciliationModule {}

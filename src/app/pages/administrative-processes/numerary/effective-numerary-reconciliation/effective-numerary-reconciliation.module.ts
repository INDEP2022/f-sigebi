import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { EffectiveNumeraryReconciliationRoutingModule } from './effective-numerary-reconciliation-routing.module';
import { EffectiveNumeraryReconciliationComponent } from './effective-numerary-reconciliation/effective-numerary-reconciliation.component';

@NgModule({
  declarations: [EffectiveNumeraryReconciliationComponent],
  imports: [
    CommonModule,
    EffectiveNumeraryReconciliationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class EffectiveNumeraryReconciliationModule {}

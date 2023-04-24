import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
import { CurrencySharedComponent } from 'src/app/@standalone/shared-forms/currency-shared/currency-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
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
    DelegationSharedComponent,
    BanksSharedComponent,
    CurrencySharedComponent,
  ],
})
export class EffectiveNumeraryReconciliationModule {}

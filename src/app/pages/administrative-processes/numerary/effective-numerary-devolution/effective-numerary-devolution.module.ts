import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from '../../../../shared/shared.module';
import { EffectiveNumeraryDevolutionRoutingModule } from './effective-numerary-devolution-routing.module';
import { EffectiveNumeraryDevolutionComponent } from './effective-numerary-devolution/effective-numerary-devolution.component';
@NgModule({
  declarations: [EffectiveNumeraryDevolutionComponent],
  imports: [
    CommonModule,
    EffectiveNumeraryDevolutionRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    ReactiveFormsModule,
  ],
})
export class EffectiveNumeraryDevolutionModule {}

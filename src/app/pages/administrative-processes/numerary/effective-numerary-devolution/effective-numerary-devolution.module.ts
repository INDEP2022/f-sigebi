import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { EffectiveNumeraryDevolutionRoutingModule } from './effective-numerary-devolution-routing.module';
import { EffectiveNumeraryDevolutionComponent } from './effective-numerary-devolution/effective-numerary-devolution.component';

@NgModule({
  declarations: [EffectiveNumeraryDevolutionComponent],
  imports: [
    CommonModule,
    EffectiveNumeraryDevolutionRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class EffectiveNumeraryDevolutionModule {}

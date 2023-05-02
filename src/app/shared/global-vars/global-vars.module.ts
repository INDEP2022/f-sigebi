import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import * as fromGlobalVars from './store/global-vars.reducer';
//import { EffectsModule } from '@ngrx/effects';
//import { GlobalVarsEffects } from './store/global-vars.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromGlobalVars.globalVarsFeatureKey,
      fromGlobalVars._reducerGlobalVars
    ),
    //EffectsModule.forFeature([GlobalVarsEffects])
  ],
})
export class GlobalVarsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';

import { PeAdbtQuarterlyAccumulatedAssetsRoutingModule } from './pe-adbt-quarterly-accumulated-assets-routing.module';
import { PeAdbtQuarterlyAccumulatedAssetsComponent } from './pe-adbt-quarterly-accumulated-assets/pe-adbt-quarterly-accumulated-assets.component';


@NgModule({
  declarations: [
    PeAdbtQuarterlyAccumulatedAssetsComponent
  ],
  imports: [
    CommonModule,
    PeAdbtQuarterlyAccumulatedAssetsRoutingModule,
    SharedModule
  ]
})
export class PeAdbtQuarterlyAccumulatedAssetsModule { }

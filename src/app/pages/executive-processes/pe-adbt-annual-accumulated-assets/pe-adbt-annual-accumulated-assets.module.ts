import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { PeAdbtAnnualAccumulatedAssetsRoutingModule } from './pe-adbt-annual-accumulated-assets-routing.module';
import { PeAdbtAnnualAccumulatedAssetsComponent } from './pe-adbt-annual-accumulated-assets/pe-adbt-annual-accumulated-assets.component';


@NgModule({
  declarations: [
    PeAdbtAnnualAccumulatedAssetsComponent
  ],
  imports: [
    CommonModule,
    PeAdbtAnnualAccumulatedAssetsRoutingModule,
    SharedModule
  ]
})
export class PeAdbtAnnualAccumulatedAssetsModule { }

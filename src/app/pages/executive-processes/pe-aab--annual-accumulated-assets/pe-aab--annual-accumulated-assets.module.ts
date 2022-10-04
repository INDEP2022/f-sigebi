import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';

import { PeAabAnnualAccumulatedAssetsRoutingModule } from './pe-aab--annual-accumulated-assets-routing.module';
import { PeAabAnnualAccumulatedAssetsComponent } from './pe-aab-annual-accumulated-assets/pe-aab-annual-accumulated-assets.component';


@NgModule({
  declarations: [
    PeAabAnnualAccumulatedAssetsComponent
  ],
  imports: [
    CommonModule,
    PeAabAnnualAccumulatedAssetsRoutingModule,
    SharedModule
  ]
})
export class PeAabAnnualAccumulatedAssetsModule { }

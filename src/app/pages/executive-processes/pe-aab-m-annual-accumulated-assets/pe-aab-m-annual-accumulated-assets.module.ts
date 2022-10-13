import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

import { PeAabMAnnualAccumulatedAssetsRoutingModule } from './pe-aab-m-annual-accumulated-assets-routing.module';
import { PeAabCAnnualAccumulatedAssetsComponent } from './pe-aab-c-annual-accumulated-assets/pe-aab-c-annual-accumulated-assets.component';

@NgModule({
  declarations: [PeAabCAnnualAccumulatedAssetsComponent],
  imports: [
    CommonModule,
    PeAabMAnnualAccumulatedAssetsRoutingModule,
    SharedModule,
    DelegationSharedComponent,
  ],
  exports: [PeAabCAnnualAccumulatedAssetsComponent],
})
export class PeAabMAnnualAccumulatedAssetsModule {}

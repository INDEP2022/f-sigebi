import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { PeAtbCQuarterlyAccumulatedAssetsComponent } from './pe-atb-c-quarterly-accumulated-assets/pe-atb-c-quarterly-accumulated-assets.component';
import { PeAtbMQuarterlyAccumulatedAssetsRoutingModule } from './pe-atb-m-quarterly-accumulated-assets-routing.module';

@NgModule({
  declarations: [PeAtbCQuarterlyAccumulatedAssetsComponent],
  imports: [
    CommonModule,
    PeAtbMQuarterlyAccumulatedAssetsRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    ModalModule.forChild(),
  ],
})
export class PeAtbMQuarterlyAccumulatedAssetsModule {}

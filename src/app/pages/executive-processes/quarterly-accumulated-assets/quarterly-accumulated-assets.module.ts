import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { QuarterlyAccumulatedAssetsRoutingModule } from './quarterly-accumulated-assets-routing.module';
import { QuarterlyAccumulatedAssetsComponent } from './quarterly-accumulated-assets/quarterly-accumulated-assets.component';

@NgModule({
  declarations: [QuarterlyAccumulatedAssetsComponent],
  imports: [
    CommonModule,
    QuarterlyAccumulatedAssetsRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    ModalModule.forChild(),
  ],
})
export class QuarterlyAccumulatedAssetsModule {}

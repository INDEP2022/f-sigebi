import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { AnnualAccumulatedAssetsRoutingModule } from './annual-accumulated-assets-routing.module';
import { AnnualAccumulatedAssetsComponent } from './annual-accumulated-assets/annual-accumulated-assets.component';

@NgModule({
  declarations: [AnnualAccumulatedAssetsComponent],
  imports: [
    CommonModule,
    AnnualAccumulatedAssetsRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    ModalModule.forChild(),
  ],
  exports: [AnnualAccumulatedAssetsComponent],
})
export class AnnualAccumulatedAssetsModule {}

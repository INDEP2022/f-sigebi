import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { PeAabCAnnualAccumulatedAssetsComponent } from './pe-aab-c-annual-accumulated-assets/pe-aab-c-annual-accumulated-assets.component';
import { PeAabMAnnualAccumulatedAssetsRoutingModule } from './pe-aab-m-annual-accumulated-assets-routing.module';

import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';

@NgModule({
  declarations: [PeAabCAnnualAccumulatedAssetsComponent],
  imports: [
    CommonModule,
    PeAabMAnnualAccumulatedAssetsRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    PreviewDocumentsComponent,
    ModalModule.forChild(),
  ],
  exports: [PeAabCAnnualAccumulatedAssetsComponent],
})
export class PeAabMAnnualAccumulatedAssetsModule {}

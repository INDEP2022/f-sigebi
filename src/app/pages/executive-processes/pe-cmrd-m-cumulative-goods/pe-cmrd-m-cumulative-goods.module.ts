import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { PeCmrdCCumulativeGoodsComponent } from './pe-cmrd-c-cumulative-goods/pe-cmrd-c-cumulative-goods.component';
import { PeCmrdMCumulativeGoodsRoutingModule } from './pe-cmrd-m-cumulative-goods-routing.module';

import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';

@NgModule({
  declarations: [PeCmrdCCumulativeGoodsComponent],
  imports: [
    CommonModule,
    PeCmrdMCumulativeGoodsRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    PreviewDocumentsComponent,
    ModalModule.forChild(),
  ],
})
export class PeCmrdMCumulativeGoodsModule {}

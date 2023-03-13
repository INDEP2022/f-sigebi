import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { AfsSharedComponentsModule } from '../afs-shared-components/afs-shared-components.module';
import { GenerateDocumentOfProgrammedGoodsRoutingModule } from './generate-document-of-programmed-goods-routing.module';
import { GenerateDocumentOfProgrammedGoodsComponent } from './generate-document-of-programmed-goods/generate-document-of-programmed-goods.component';

@NgModule({
  declarations: [GenerateDocumentOfProgrammedGoodsComponent],
  imports: [
    CommonModule,
    GenerateDocumentOfProgrammedGoodsRoutingModule,
    SharedModule,
    AfsSharedComponentsModule,
    ReactiveFormsModule,
  ],
})
export class GenerateDocumentOfProgrammedGoodsModule {}

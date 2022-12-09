import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GenerateDocumentOfProgrammedGoodsRoutingModule } from './generate-document-of-programmed-goods-routing.module';
import { GenerateDocumentOfProgrammedGoodsComponent } from './generate-document-of-programmed-goods/generate-document-of-programmed-goods.component';

@NgModule({
  declarations: [GenerateDocumentOfProgrammedGoodsComponent],
  imports: [CommonModule, GenerateDocumentOfProgrammedGoodsRoutingModule],
})
export class GenerateDocumentOfProgrammedGoodsModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GenerateDocumentNotAcceptedGoodsRoutingModule } from './generate-document-not-accepted-goods-routing.module';
import { GenerateDocumentNotAcceptedGoodsComponent } from './generate-document-not-accepted-goods/generate-document-not-accepted-goods.component';

@NgModule({
  declarations: [GenerateDocumentNotAcceptedGoodsComponent],
  imports: [CommonModule, GenerateDocumentNotAcceptedGoodsRoutingModule],
})
export class GenerateDocumentNotAcceptedGoodsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrGoodsRoutingModule } from './dr-goods-routing.module';
import { DrGoodsCaptureComponent } from './dr-goods-capture/dr-goods-capture.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [DrGoodsCaptureComponent],
  imports: [
    CommonModule,
    DrGoodsRoutingModule,
    SharedModule,
    GoodsTypesSharedComponent,
    ModalModule.forChild(),
  ],
})
export class DrGoodsModule {}

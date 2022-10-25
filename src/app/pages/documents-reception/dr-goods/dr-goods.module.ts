import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DrGoodsCaptureRecordSelectComponent } from './dr-goods-capture/components/dr-goods-capture-record-select/dr-goods-capture-record-select.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DrGoodsCaptureComponent } from './dr-goods-capture/dr-goods-capture.component';
import { DrGoodsRoutingModule } from './dr-goods-routing.module';

@NgModule({
  declarations: [DrGoodsCaptureComponent, DrGoodsCaptureRecordSelectComponent],
  imports: [
    CommonModule,
    DrGoodsRoutingModule,
    SharedModule,
    GoodsTypesSharedComponent,
    ModalModule.forChild(),
  ],
})
export class DrGoodsModule {}

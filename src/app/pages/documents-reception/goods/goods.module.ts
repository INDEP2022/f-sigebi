import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodsCaptureRecordSelectComponent } from './goods-capture/components/goods-capture-record-select/goods-capture-record-select.component';
import { GoodsCaptureComponent } from './goods-capture/goods-capture.component';
import { GoodsRoutingModule } from './goods-routing.module';

@NgModule({
  declarations: [GoodsCaptureComponent, GoodsCaptureRecordSelectComponent],
  imports: [
    CommonModule,
    GoodsRoutingModule,
    SharedModule,
    GoodsTypesSharedComponent,
    ModalModule.forChild(),
  ],
})
export class GoodsModule {}

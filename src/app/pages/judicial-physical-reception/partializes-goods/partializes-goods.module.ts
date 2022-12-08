import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { PartializesGoodsRoutingModule } from './partializes-goods-routing.module';
import { PartializesGoodsComponent } from './partializes-goods.component';

@NgModule({
  declarations: [PartializesGoodsComponent],
  imports: [
    CommonModule,
    PartializesGoodsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class PartializesGoodsModule {}

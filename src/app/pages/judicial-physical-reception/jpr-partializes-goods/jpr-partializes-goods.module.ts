import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { JprPartializesGoodsRoutingModule } from './jpr-partializes-goods-routing.module';
import { JprPartializesGoodsComponent } from './jpr-partializes-goods.component';

@NgModule({
  declarations: [JprPartializesGoodsComponent],
  imports: [
    CommonModule,
    JprPartializesGoodsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class JprPartializesGoodsModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { JprPartializesGeneralGoodsRoutingModule } from './jpr-partializes-general-goods-routing.module';
import { JprPartializesGeneralGoodsComponent } from './jpr-partializes-general-goods.component';

@NgModule({
  declarations: [JprPartializesGeneralGoodsComponent],
  imports: [
    CommonModule,
    JprPartializesGeneralGoodsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class JprPartializesGeneralGoodsModule {}
